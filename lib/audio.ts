// Web Audio API & Speech Synthesis Helpers

let alarmOscillator: OscillatorNode | null = null;
let alarmGainNode: GainNode | null = null;
let audioContext: AudioContext | null = null;

/**
 * Text-to-Speech synthesis for Multilingual Directives (English / Hindi)
 */
export function speakDirective(text: string, lang: 'en' | 'hi' | 'te' = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return;
  }

  // Cancel any active speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
  utterance.rate = 0.95; // Slightly slower for clear hospital ward instructions
  utterance.pitch = 1.0;

  // Try to find native voice
  const voices = window.speechSynthesis.getVoices();
  if (lang === 'te') {
    const teluguVoice = voices.find(v => v.lang.includes('te') || v.name.includes('Telugu'));
    if (teluguVoice) utterance.voice = teluguVoice;
  } else if (lang === 'hi') {
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi'));
    if (hindiVoice) utterance.voice = hindiVoice;
  } else {
    const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.default));
    if (englishVoice) utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Play a crisp 0.12s barcode scanner confirmation chime (High C 1046.5Hz)
 */
export function playScanBeep() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (err) {
    console.warn('Audio beep playback failed:', err);
  }
}

/**
 * Web Audio API Emergency Siren Synthesizer (880Hz / 440Hz pulsing pitch)
 */
export function startAlarmSiren() {
  if (typeof window === 'undefined') return;

  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContext = new AudioCtx();
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    if (alarmOscillator) {
      alarmOscillator.stop();
      alarmOscillator.disconnect();
    }

    alarmOscillator = audioContext.createOscillator();
    alarmGainNode = audioContext.createGain();

    alarmOscillator.type = 'sawtooth';
    
    // Siren frequency sweep (880Hz to 440Hz pulse)
    const now = audioContext.currentTime;
    alarmOscillator.frequency.setValueAtTime(880, now);
    alarmOscillator.frequency.exponentialRampToValueAtTime(440, now + 0.3);
    alarmOscillator.frequency.exponentialRampToValueAtTime(880, now + 0.6);

    // Loop frequency modulation
    let isHigh = true;
    const sirenInterval = setInterval(() => {
      if (!alarmOscillator || !audioContext) {
        clearInterval(sirenInterval);
        return;
      }
      const t = audioContext.currentTime;
      alarmOscillator.frequency.setValueAtTime(isHigh ? 440 : 880, t);
      alarmOscillator.frequency.linearRampToValueAtTime(isHigh ? 880 : 440, t + 0.25);
      isHigh = !isHigh;
    }, 300);

    alarmGainNode.gain.setValueAtTime(0.25, now);

    alarmOscillator.connect(alarmGainNode);
    alarmGainNode.connect(audioContext.destination);

    alarmOscillator.start();
  } catch (err) {
    console.error('Failed to initialize Web Audio API Siren:', err);
  }
}

export function stopAlarmSiren() {
  try {
    if (alarmOscillator) {
      alarmOscillator.stop();
      alarmOscillator.disconnect();
      alarmOscillator = null;
    }
  } catch (err) {
    console.error('Error stopping siren:', err);
  }
}
