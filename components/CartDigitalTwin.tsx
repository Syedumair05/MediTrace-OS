'use client';

import React from 'react';
import { 
  Lock, 
  Unlock, 
  AlertOctagon, 
  Weight, 
  Gauge, 
  ShieldAlert, 
  Layers, 
  FileCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { BinState, BinCategory, AuditLogEntry } from '@/lib/types';

interface CartDigitalTwinProps {
  binStates: Record<BinCategory, BinState>;
  activeCategory: BinCategory | null;
  isAlarmActive: boolean;
  auditLogs: AuditLogEntry[];
  onToggleAlarm: () => void;
  onOpenManifest: () => void;
  onSimulateWeightAdd: (category: BinCategory) => void;
  onResetBins: () => void;
}

export default function CartDigitalTwin({
  binStates,
  activeCategory,
  isAlarmActive,
  auditLogs = [],
  onToggleAlarm,
  onOpenManifest,
  onSimulateWeightAdd,
  onResetBins
}: CartDigitalTwinProps) {
  const getBinStyle = (category: BinCategory, isUnlocked: boolean) => {
    switch (category) {
      case 'YELLOW':
        return {
          headerBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
          borderGlow: isUnlocked ? 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'border-yellow-500/30',
          progressClass: 'progress-fill-yellow'
        };
      case 'RED':
        return {
          headerBg: 'bg-red-500/20 text-red-400 border-red-500/40',
          borderGlow: isUnlocked ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-red-500/30',
          progressClass: 'progress-fill-red'
        };
      case 'BLUE':
        return {
          headerBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
          borderGlow: isUnlocked ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'border-blue-500/30',
          progressClass: 'progress-fill-blue'
        };
      case 'WHITE':
        return {
          headerBg: 'bg-slate-200/20 text-slate-100 border-slate-300/40',
          borderGlow: isUnlocked ? 'border-slate-100 shadow-[0_0_20px_rgba(248,250,252,0.4)]' : 'border-slate-300/30',
          progressClass: 'progress-fill-white'
        };
    }
  };

  const categories: BinCategory[] = ['YELLOW', 'RED', 'BLUE', 'WHITE'];
  const totalShiftWeight = categories.reduce((sum, cat) => sum + binStates[cat].currentWeightKg, 0);

  return (
    <div className={`bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-6 relative transition-all ${
      isAlarmActive ? 'emergency-alarm-active' : ''
    }`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              IoT Cart Digital Twin & Active Interlocks
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Live Load-Cell Telemetry • Dynamic Solenoid Lid Locks
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zero Load Cells / Tare Calibration Reset Button */}
          <button
            onClick={onResetBins}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 font-mono text-xs rounded-lg flex items-center gap-1.5 transition-all"
            title="Reset all bin weights to 0.00 kg (Tare Load Cell Calibration)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Load Cells (Tare)</span>
          </button>

          {/* Mismatch Alarm Toggle */}
          <button
            onClick={onToggleAlarm}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isAlarmActive
                ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-lg shadow-red-600/50'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-red-500/50 hover:text-red-400'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            {isAlarmActive ? 'ALARM ACTIVE' : 'Simulate Mismatch'}
          </button>

          {/* Close Shift / Seal Batch Button */}
          <button
            onClick={onOpenManifest}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <FileCheck className="w-4 h-4" />
            Seal Batch / Form-IV
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      {isAlarmActive && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border-2 border-red-500 text-red-200 flex items-center gap-3 animate-pulse">
          <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-red-100">CRITICAL MISSEGREGATION ALARM TRIGGERED!</h4>
            <p className="text-xs text-red-300 font-mono">
              Unauthorized lid forced or wrong bin weight detected! Web Audio Siren sounding.
            </p>
          </div>
        </div>
      )}

      {/* 4-Bin Digital Twin Grid */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map(cat => {
          const bin = binStates[cat];
          const isUnlocked = activeCategory === cat || bin.isUnlocked;
          const styles = getBinStyle(cat, isUnlocked);
          const fillPercent = Math.min(100, Math.round((bin.currentWeightKg / bin.capacityKg) * 100));

          return (
            <div
              key={cat}
              className={`p-4 rounded-xl bg-slate-950/90 border transition-all flex flex-col justify-between gap-4 ${styles.borderGlow}`}
            >
              {/* Compartment Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${styles.headerBg}`}>
                    {cat} CONTAINER
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">{bin.name}</h3>
                </div>

                {/* Lock Status Interlock Badge */}
                <div className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1 transition-all ${
                  isUnlocked ? 'badge-unlocked' : 'badge-locked'
                }`}>
                  {isUnlocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                      UNLOCKED
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-red-400" />
                      LOCKED
                    </>
                  )}
                </div>
              </div>

              {/* Telemetry Progress Bar & Weight */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Weight className="w-3.5 h-3.5 text-cyan-400" />
                    Load Cell:
                  </span>
                  <span className="font-bold text-white">
                    {bin.currentWeightKg.toFixed(2)} / {bin.capacityKg} kg
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${styles.progressClass}`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Capacity: {fillPercent}%</span>
                  <span>Items: {bin.itemCount}</span>
                </div>
              </div>

              {/* Quick Weight Sim Button */}
              <button
                onClick={() => onSimulateWeightAdd(cat)}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] font-mono rounded-lg flex items-center justify-center gap-1 transition-all"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                Simulate Disposal (+{cat === 'YELLOW' ? '0.45' : cat === 'RED' ? '0.25' : cat === 'BLUE' ? '0.18' : '0.12'}kg)
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Summary Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Total Shift Payload:</span>
          <span className="font-bold text-cyan-300 text-sm">{totalShiftWeight.toFixed(2)} kg</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Interlock Solenoids:</span>
          <span className="text-emerald-400 font-bold">ACTIVE (1/4 UNLOCKED)</span>
        </div>
      </div>

      {/* Near-Miss Audit Log Feed */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Near-Miss & Interlock Audit Log Feed
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            {auditLogs.length} Events Recorded
          </span>
        </div>

        <div className="max-h-[140px] overflow-y-auto flex flex-col gap-2 border border-slate-800/80 rounded-xl p-2 bg-slate-950/60 font-mono text-xs">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 text-[11px] italic p-2 text-center">
              No audit incidents logged yet. System operating in full compliance.
            </p>
          ) : (
            auditLogs.map(log => (
              <div
                key={log.id}
                className={`p-2 rounded-lg border flex items-start justify-between gap-3 ${
                  log.level === 'CRITICAL'
                    ? 'bg-red-950/40 border-red-800/80 text-red-200'
                    : log.level === 'COMPLIANT'
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      log.level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {log.type}
                    </span>
                    <span className="font-bold text-white text-[11px]">{log.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{log.details}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
