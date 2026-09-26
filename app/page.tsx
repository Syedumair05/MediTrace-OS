'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  HeartPulse, 
  RotateCcw, 
  Sparkles
} from 'lucide-react';
import CameraScanner from '@/components/CameraScanner';
import CartDigitalTwin from '@/components/CartDigitalTwin';
import CPCBManifestModal from '@/components/CPCBManifestModal';
import { BinState, BinCategory, WasteClassificationResult, AuditLogEntry } from '@/lib/types';
import { startAlarmSiren, stopAlarmSiren, playScanBeep } from '@/lib/audio';

const INITIAL_BINS: Record<BinCategory, BinState> = {
  YELLOW: {
    category: 'YELLOW',
    name: 'Infectious / Soiled Waste',
    color: '#EAB308',
    bgGradient: 'from-yellow-500/20 to-yellow-600/10',
    borderGlow: 'border-yellow-500/40',
    currentWeightKg: 0.00,
    capacityKg: 15.0,
    itemCount: 0,
    isUnlocked: false,
    treatment: 'Incineration at 1050°C / Plasma Pyrolysis (0% Recyclable)',
    recyclability: 0,
    iconName: 'FileText'
  },
  RED: {
    category: 'RED',
    name: 'Contaminated Plastics',
    color: '#EF4444',
    bgGradient: 'from-red-500/20 to-red-600/10',
    borderGlow: 'border-red-500/40',
    currentWeightKg: 0.00,
    capacityKg: 15.0,
    itemCount: 0,
    isUnlocked: false,
    treatment: 'Autoclaving / Shredding & Plastic Polymer Recycling (95% Recyclable)',
    recyclability: 95,
    iconName: 'Pipette'
  },
  BLUE: {
    category: 'BLUE',
    name: 'Glassware & Implants',
    color: '#3B82F6',
    bgGradient: 'from-blue-500/20 to-blue-600/10',
    borderGlow: 'border-blue-500/40',
    currentWeightKg: 0.00,
    capacityKg: 10.0,
    itemCount: 0,
    isUnlocked: false,
    treatment: 'Sodium Hypochlorite Chemical Disinfection & Glass Smelting',
    recyclability: 85,
    iconName: 'FlaskConical'
  },
  WHITE: {
    category: 'WHITE',
    name: 'Sharps Puncture-Proof',
    color: '#F8FAFC',
    bgGradient: 'from-slate-200/20 to-slate-400/10',
    borderGlow: 'border-slate-300/40',
    currentWeightKg: 0.00,
    capacityKg: 8.0,
    itemCount: 0,
    isUnlocked: false,
    treatment: 'Autoclaving & Needle Mutilation / Encapsulation',
    recyclability: 10,
    iconName: 'Syringe'
  }
};

export default function MediTracePage() {
  const [binStates, setBinStates] = useState<Record<BinCategory, BinState>>(INITIAL_BINS);
  const [activeCategory, setActiveCategory] = useState<BinCategory | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);
  const [isManifestOpen, setIsManifestOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Hydration safety mount effect & localStorage sync for logistics portal
  useEffect(() => {
    setIsMounted(true);
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAuditLogs([
      {
        id: 'init-1',
        timestamp: timeStr,
        type: 'CLASSIFICATION',
        level: 'COMPLIANT',
        title: 'Trolley Telemetry Calibrated',
        details: 'Load cells zeroed. Dynamic lid interlocks armed and locked.'
      }
    ]);
  }, []);

  // Save live binStates to localStorage so CBWTF Logistics Portal reads exact live telemetry
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('meditrace_bin_states', JSON.stringify(binStates));
    }
  }, [binStates]);

  const addAuditLog = (
    type: AuditLogEntry['type'],
    level: AuditLogEntry['level'],
    title: string,
    details: string
  ) => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      type,
      level,
      title,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handle classification completion from camera scanner or presets
  const handleClassificationComplete = (result: WasteClassificationResult) => {
    const category = result.bin_category;
    setActiveCategory(category);

    playScanBeep();

    addAuditLog(
      'CLASSIFICATION',
      'COMPLIANT',
      `Item Verified: ${result.item_name}`,
      `BMWM Category: ${category}. Target bin lid unlocked automatically; remaining 3 interlocked.`
    );

    // Update bin states so target bin unlocks and non-target bins lock
    setBinStates(prev => {
      const updated = { ...prev };
      const categories: BinCategory[] = ['YELLOW', 'RED', 'BLUE', 'WHITE'];
      categories.forEach(cat => {
        const isTarget = cat === category;
        const addedWeight = isTarget ? (result.estimated_weight_kg || 0.25) : 0;
        updated[cat] = {
          ...prev[cat],
          currentWeightKg: prev[cat].currentWeightKg + addedWeight,
          itemCount: isTarget ? prev[cat].itemCount + 1 : prev[cat].itemCount,
          isUnlocked: isTarget
        };
      });
      return updated;
    });
  };

  // Simulate manual weight addition to a bin
  const handleSimulateWeightAdd = (category: BinCategory) => {
    setActiveCategory(category);
    const addedWeightMap: Record<BinCategory, number> = {
      YELLOW: 0.45,
      RED: 0.25,
      BLUE: 0.18,
      WHITE: 0.12
    };

    addAuditLog(
      'WEIGHT_ADDITION',
      'COMPLIANT',
      `Manual Payload Simulated (${category})`,
      `Added +${addedWeightMap[category]}kg payload to ${category} bin load cell.`
    );

    setBinStates(prev => {
      const updated = { ...prev };
      const categories: BinCategory[] = ['YELLOW', 'RED', 'BLUE', 'WHITE'];
      categories.forEach(cat => {
        const isTarget = cat === category;
        updated[cat] = {
          ...prev[cat],
          currentWeightKg: isTarget ? prev[cat].currentWeightKg + addedWeightMap[category] : prev[cat].currentWeightKg,
          itemCount: isTarget ? prev[cat].itemCount + 1 : prev[cat].itemCount,
          isUnlocked: isTarget
        };
      });
      return updated;
    });
  };

  // Toggle Mismatch Siren Alarm
  const handleToggleAlarm = () => {
    if (isAlarmActive) {
      setIsAlarmActive(false);
      stopAlarmSiren();
      addAuditLog(
        'MISMATCH_ALARM',
        'INFO',
        'Emergency Siren Deactivated',
        'Mismatch alarm cleared by operator. Solenoids re-armed.'
      );
    } else {
      setIsAlarmActive(true);
      startAlarmSiren();
      addAuditLog(
        'MISMATCH_ALARM',
        'CRITICAL',
        '🔴 CRITICAL NEAR-MISS: Contamination Mismatch Triggered!',
        'Solenoid interlock forced on locked bin during infectious disposal! Web Audio Siren sounding.'
      );
    }
  };

  const handleOpenManifest = () => {
    addAuditLog(
      'BATCH_SEALED',
      'COMPLIANT',
      'CPCB Form-IV Batch Sealed',
      'Shift complete. QR serialization code generated for CBWTF vehicle handover.'
    );
    setIsManifestOpen(true);
  };

  // Reset shift simulation stats
  const handleResetShift = () => {
    if (isAlarmActive) {
      setIsAlarmActive(false);
      stopAlarmSiren();
    }
    setActiveCategory(null);
    setBinStates(INITIAL_BINS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 flex flex-col gap-6">
      {/* Top Header */}
      <header className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
                MediTrace OS
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                KIT26038
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                BMWM 2016 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Smart Mobile Medical-Waste Collection, Computer-Vision AI & IoT Cart Interlock OS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/logistics"
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Radio className="w-4 h-4" />
            <span>CBWTF Logistics Portal</span>
          </a>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Telemetry:</span>
            <span className="text-emerald-400 font-bold">10Hz ONLINE</span>
          </div>

          <button
            onClick={handleResetShift}
            className="p-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Reset shift telemetry"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Reset Shift</span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Responsive Dashboard Grid (5 Cols vs 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (col-span-5): AI Vision Scanner */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <CameraScanner
            onClassificationComplete={handleClassificationComplete}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Right Column (col-span-7): Cart Digital Twin & Active Interlocks */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <CartDigitalTwin
            binStates={binStates}
            activeCategory={activeCategory}
            isAlarmActive={isAlarmActive}
            auditLogs={auditLogs}
            onToggleAlarm={handleToggleAlarm}
            onOpenManifest={handleOpenManifest}
            onSimulateWeightAdd={handleSimulateWeightAdd}
            onResetBins={handleResetShift}
          />
        </div>
      </div>

      {/* Footer Info Bar */}
      <footer className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Statutory Compliance: Bio-Medical Waste Management (BMWM) Rules 2016 CPCB India</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Kasturba Hospital & Research</span>
          <span>•</span>
          <span>Ward 4B Cart #02</span>
        </div>
      </footer>

      {/* CPCB Form-IV Digital Audit Manifest Modal */}
      {isMounted && (
        <CPCBManifestModal
          isOpen={isManifestOpen}
          onClose={() => setIsManifestOpen(false)}
          binStates={binStates}
        />
      )}
    </div>
  );
}
