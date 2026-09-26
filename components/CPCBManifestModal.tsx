'use client';

import React, { useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  FileSpreadsheet,
  Award
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { BinState, BinCategory } from '@/lib/types';

interface CPCBManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  binStates: Record<BinCategory, BinState>;
}

export default function CPCBManifestModal({
  isOpen,
  onClose,
  binStates
}: CPCBManifestModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const manifestId = 'CPCB-2026-0926-8842';
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  const categories: BinCategory[] = ['YELLOW', 'RED', 'BLUE', 'WHITE'];
  const totalWeight = categories.reduce((sum, cat) => sum + binStates[cat].currentWeightKg, 0);
  const totalItems = categories.reduce((sum, cat) => sum + binStates[cat].itemCount, 0);

  // Generate QR Code payload
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (canvasRef.current) {
        const payload = JSON.stringify({
          manifestId,
          facility: 'Kasturba Healthcare & Research Institute (Ward 4B)',
          cpcbAuth: 'CPCB/BMWM/2026/KA-9401',
          timestamp,
          totalWeightKg: totalWeight.toFixed(2),
          totalItems,
          breakdown: {
            YELLOW: `${binStates.YELLOW.currentWeightKg.toFixed(2)}kg`,
            RED: `${binStates.RED.currentWeightKg.toFixed(2)}kg`,
            BLUE: `${binStates.BLUE.currentWeightKg.toFixed(2)}kg`,
            WHITE: `${binStates.WHITE.currentWeightKg.toFixed(2)}kg`
          }
        });

        QRCode.toCanvas(canvasRef.current, payload, {
          width: 160,
          margin: 1,
          color: {
            dark: '#0F172A',
            light: '#FFFFFF'
          }
        }).catch(err => console.error('QR Generation failed:', err));
      }
    }
  }, [isOpen, binStates, totalWeight, totalItems, timestamp]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl bg-slate-900 border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                CPCB Form-IV Digital Compliance Manifest
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Statutory Bio-Medical Waste Management Rules 2016 • Serial #{manifestId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Facility & Shift Details */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Healthcare Facility & Ward:</span>
              </div>
              <p className="text-slate-200 font-bold text-sm">
                Kasturba Healthcare & Research (Ward 4B)
              </p>
              <p className="text-[11px] text-slate-400">CPCB Authorization No: CPCB/BMWM/2026/KA-9401</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Shift Seal Timestamp:</span>
              </div>
              <p className="text-slate-200 font-bold text-sm">
                {timestamp}
              </p>
              <p className="text-[11px] text-emerald-400 font-bold">Status: BATCH SEALED & VERIFIED</p>
            </div>
          </div>

          {/* Category Weight Breakdown Table */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              Statutory Waste Category Weight Breakdown (BMWM 2016)
            </h4>

            <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                    <th className="p-3">Category Bin</th>
                    <th className="p-3">Waste Protocol</th>
                    <th className="p-3 text-center">Items</th>
                    <th className="p-3 text-right">Net Weight (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {categories.map(cat => {
                    const bin = binStates[cat];
                    return (
                      <tr key={cat} className="hover:bg-slate-800/30">
                        <td className="p-3 font-bold flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${
                            cat === 'YELLOW' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' :
                            cat === 'RED' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                            cat === 'BLUE' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' :
                            'bg-slate-100 shadow-[0_0_8px_rgba(248,250,252,0.8)]'
                          }`} />
                          {cat} CONTAINER
                        </td>
                        <td className="p-3 text-slate-300 text-[11px]">
                          {bin.treatment}
                        </td>
                        <td className="p-3 text-center text-slate-200">{bin.itemCount}</td>
                        <td className="p-3 text-right font-bold text-cyan-300">
                          {bin.currentWeightKg.toFixed(2)} kg
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-950 font-bold text-white">
                    <td colSpan={2} className="p-3 text-right uppercase font-mono">Total Shift Payload:</td>
                    <td className="p-3 text-center text-cyan-400">{totalItems}</td>
                    <td className="p-3 text-right text-emerald-400 text-sm">{totalWeight.toFixed(2)} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* QR Serialization Code & Signature Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-md border border-slate-700">
                <canvas ref={canvasRef} className="w-28 h-28" />
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  CBWTF Serialization Barcode
                </span>
                <p className="text-slate-400 text-[11px] max-w-[280px]">
                  Scannable by CBWTF transport vehicle operator for immutable handover verification.
                </p>
                <span className="text-[10px] font-mono text-cyan-400 mt-1">
                  Hash: 0x94f8a...e102c9
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 text-right">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <Award className="w-4 h-4" />
                CPCB Rules 2016 Compliant
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Infection Control Officer Seal</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-mono">
            MediTrace OS (KIT26038) • Verification Engine Active
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Done & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
