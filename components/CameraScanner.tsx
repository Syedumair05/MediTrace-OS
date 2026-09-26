'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Volume2, 
  AlertTriangle, 
  Recycle, 
  ShieldAlert, 
  CheckCircle2,
  RefreshCw,
  FileText,
  Pipette,
  FlaskConical,
  Syringe
} from 'lucide-react';
import { DEMO_PRESETS } from '@/lib/presets';
import { WasteClassificationResult } from '@/lib/types';
import { speakDirective } from '@/lib/audio';

interface CameraScannerProps {
  onClassificationComplete: (result: WasteClassificationResult) => void;
  isAnalyzing: boolean;
}

export default function CameraScanner({
  onClassificationComplete,
  isAnalyzing
}: CameraScannerProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'presets'>('presets');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<WasteClassificationResult | null>(null);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'te'>('en');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera stream when camera tab is active
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam interface not supported on this browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.warn('Unable to access webcam:', err);
      setCameraError('Webcam unavailable or permission denied. Switched to Image Upload / Demo Presets.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreviewImage(dataUrl);
      analyzeWasteImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      setPreviewImage(resultStr);
      analyzeWasteImage(resultStr);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = async (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = DEMO_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setCurrentResult(preset.result);
    onClassificationComplete(preset.result);

    // Speak audio directive
    speakDirective(preset.result.voice_directives[selectedLang], selectedLang);
  };

  const analyzeWasteImage = async (base64Image: string) => {
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const result: WasteClassificationResult = data.data;
        setCurrentResult(result);
        onClassificationComplete(result);
        speakDirective(result.voice_directives[selectedLang], selectedLang);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
    }
  };

  const playCurrentVoiceDirective = () => {
    if (currentResult) {
      speakDirective(currentResult.voice_directives[selectedLang], selectedLang);
    }
  };

  const getBinBadgeStyle = (category: string) => {
    switch (category) {
      case 'YELLOW':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'RED':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'BLUE':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'WHITE':
        return 'bg-slate-200/20 text-slate-100 border-slate-300/40';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'Pipette': return <Pipette className="w-5 h-5" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
      case 'Syringe': return <Syringe className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-6">
      {/* Header & Viewport Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            AI Vision Scanner Engine
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'presets' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Demo Presets
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'camera' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Webcam
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'upload' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload Image
          </button>
        </div>
      </div>

      {/* Main Scanner Viewport Area */}
      <div className="relative min-h-[260px] bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center p-4">
        {/* Preset Selector Grid */}
        {activeTab === 'presets' && (
          <div className="w-full flex flex-col gap-3">
            <p className="text-xs font-medium text-slate-400 text-center">
              Select a statutory BMWM 2016 item preset for instant classification test:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {DEMO_PRESETS.map(preset => {
                const isSelected = selectedPresetId === preset.id;
                const binCat = preset.result.bin_category;

                const glowStyle = isSelected
                  ? binCat === 'YELLOW' ? 'bg-yellow-950/40 border-yellow-500 shadow-[0_0_18px_rgba(234,179,8,0.35)]' :
                    binCat === 'RED' ? 'bg-red-950/40 border-red-500 shadow-[0_0_18px_rgba(239,68,68,0.35)]' :
                    binCat === 'BLUE' ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.35)]' :
                    'bg-slate-900 border-slate-200 shadow-[0_0_18px_rgba(248,250,252,0.35)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90';

                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all group ${glowStyle}`}
                  >
                    {/* Left Details */}
                    <div className="flex flex-col gap-2 flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${
                          binCat === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-400' :
                          binCat === 'RED' ? 'bg-red-500/20 text-red-400' :
                          binCat === 'BLUE' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-200/20 text-slate-200'
                        }`}>
                          {getPresetIcon(preset.svgIcon)}
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          getBinBadgeStyle(binCat)
                        }`}>
                          {binCat}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 leading-snug">
                          {preset.label}
                        </h4>
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-950/80 text-slate-300 border border-slate-800">
                          {preset.sublabel}
                        </span>
                      </div>
                    </div>

                    {/* Right Medical Waste Reference Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 shadow-inner flex-shrink-0 bg-slate-950 relative">
                      <img
                        src={preset.imageUrl}
                        alt={preset.label}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Hide broken image gracefully if offline
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Webcam Tab */}
        {activeTab === 'camera' && (
          <div className="relative w-full h-full min-h-[240px] flex flex-col items-center justify-center">
            {cameraError ? (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-center flex flex-col items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-red-400 animate-bounce" />
                <div>
                  <p className="text-xs font-bold text-red-200">{cameraError}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    No hardware camera feed active. Please select a Demo Preset or Upload an Image.
                  </p>
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setActiveTab('presets')}
                    className="px-3 py-1.5 bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg"
                  >
                    Use Demo Presets
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-lg border border-slate-700"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[220px] object-cover rounded-lg border border-slate-800"
                />
                <button
                  onClick={captureWebcamSnapshot}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 hover:brightness-110 shadow-lg shadow-cyan-500/20"
                >
                  <Camera className="w-4 h-4" />
                  Capture & Classify Item
                </button>
              </>
            )}
          </div>
        )}

        {/* Upload File Tab */}
        {activeTab === 'upload' && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[220px] border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer p-6 transition-all bg-slate-900/20 hover:bg-slate-900/40"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-cyan-400" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300">
                Click or drag & drop medical waste photo
              </p>
              <p className="text-xs text-slate-500">Supports PNG, JPG, WEBP formats</p>
            </div>
          </div>
        )}

        {/* Analyzing Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-xs font-mono text-cyan-300 animate-pulse">
              Gemini Vision AI Analyzing BMWM Statutory Rules...
            </p>
          </div>
        )}
      </div>

      {/* Result Output Card & Voice Directive Control */}
      {currentResult && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4">
          {/* Classification Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Identified Object:</span>
                <span className="text-sm font-bold text-white">{currentResult.item_name}</span>
              </div>
              <p className="text-xs font-mono text-slate-300">
                Target: <span className="font-bold underline decoration-cyan-500">{currentResult.bin_label}</span>
              </p>
            </div>

            <div className={`px-3 py-1 rounded-md border text-xs font-mono font-bold ${getBinBadgeStyle(currentResult.bin_category)}`}>
              {currentResult.bin_category} BIN
            </div>
          </div>

          {/* Badges & Metrics Row */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 font-mono">Pathogen Risk:</span>
              <span className={`font-bold flex items-center gap-1 ${
                currentResult.pathogen_risk === 'Extreme' ? 'text-red-400' :
                currentResult.pathogen_risk === 'High' ? 'text-orange-400' :
                currentResult.pathogen_risk === 'Moderate' ? 'text-yellow-400' :
                'text-emerald-400'
              }`}>
                <ShieldAlert className="w-3.5 h-3.5" />
                {currentResult.pathogen_risk}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 font-mono">Recyclability:</span>
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                <Recycle className="w-3.5 h-3.5" />
                {currentResult.recyclability_percent}%
              </span>
            </div>
          </div>

          {/* Treatment Directive */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex flex-col gap-1">
            <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">Statutory Disposal Protocol:</span>
            <p className="text-slate-200 font-medium">{currentResult.treatment_method}</p>
          </div>

          {/* Voice Feedback Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={playCurrentVoiceDirective}
                className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all"
              >
                <Volume2 className="w-4 h-4" />
                Play Audio Directive
              </button>

              {/* Language Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setSelectedLang('en')}
                  className={`px-2 py-0.5 rounded ${selectedLang === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setSelectedLang('hi')}
                  className={`px-2 py-0.5 rounded ${selectedLang === 'hi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  HI (हिंदी)
                </button>
                <button
                  onClick={() => setSelectedLang('te')}
                  className={`px-2 py-0.5 rounded ${selectedLang === 'te' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  TE (తెలుగు)
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic max-w-[200px] truncate">
              "{currentResult.voice_directives[selectedLang]}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
