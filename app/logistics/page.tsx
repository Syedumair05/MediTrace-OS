'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowLeft, Radio, Sparkles } from 'lucide-react';
import CBWTFHandoverPortal from '@/components/CBWTFHandoverPortal';

export default function LogisticsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-all text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Bedside Trolley OS</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                MediTrace Logistics
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                CBWTF PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Common Bio-medical Waste Treatment Facility Transport & Weighbridge Reconciler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Fleet GPS:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Logistics Content Component */}
      <CBWTFHandoverPortal />

      {/* Footer Info Bar */}
      <footer className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Statutory Compliance: Bio-Medical Waste Management (BMWM) Rules 2016 CPCB Transport Guidelines</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>CBWTF License KA-MW-2026</span>
          <span>•</span>
          <span>Truck #KA-01-MW-9401</span>
        </div>
      </footer>
    </main>
  );
}
