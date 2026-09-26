'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  QrCode, 
  Scale, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight,
  RefreshCw,
  Award
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

import { BinState, BinCategory } from '@/lib/types';

interface ScannedManifest {
  manifestId: string;
  facility: string;
  cpcbAuth: string;
  timestamp: string;
  totalWeightKg: number;
  totalItems: number;
  breakdown: Record<string, string>;
}

export default function CBWTFHandoverPortal() {
  const [scannedData, setScannedData] = useState<ScannedManifest>({
    manifestId: 'CPCB-2026-0926-8842',
    facility: 'Kasturba Healthcare & Research (Ward 4B)',
    cpcbAuth: 'CPCB/BMWM/2026/KA-9401',
    timestamp: '26 Sep 2026, 16:45:00',
    totalWeightKg: 5.48,
    totalItems: 20,
    breakdown: {
      YELLOW: '1.35 kg (4 items)',
      RED: '2.75 kg (8 items)',
      BLUE: '0.90 kg (3 items)',
      WHITE: '0.48 kg (5 items)'
    }
  });

  const [truckScaleKg, setTruckScaleKg] = useState<number>(5.48);
  const [driverName, setDriverName] = useState<string>('Ramesh Kumar (ID: CBWTF-DR-902)');
  const [hospitalSignee, setHospitalSignee] = useState<string>('Sr. Nurse Anita Roy (Ward 4B)');
  const [handoverComplete, setHandoverComplete] = useState<boolean>(false);
  const [transitProgress, setTransitProgress] = useState<number>(35); // 35% along route
  const [receiptQrUrl, setReceiptQrUrl] = useState<string>('');

  // Read live telemetry state from IoT Cart Digital Twin saved in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('meditrace_bin_states');
      if (saved) {
        try {
          const parsed: Record<BinCategory, BinState> = JSON.parse(saved);
          const yellowKg = parsed.YELLOW.currentWeightKg || 0;
          const redKg = parsed.RED.currentWeightKg || 0;
          const blueKg = parsed.BLUE.currentWeightKg || 0;
          const whiteKg = parsed.WHITE.currentWeightKg || 0;
          const totalKg = yellowKg + redKg + blueKg + whiteKg;
          const totalItems = (parsed.YELLOW.itemCount || 0) + (parsed.RED.itemCount || 0) + (parsed.BLUE.itemCount || 0) + (parsed.WHITE.itemCount || 0);

          const timeStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

          setScannedData({
            manifestId: 'CPCB-2026-0926-8842',
            facility: 'Kasturba Healthcare & Research (Ward 4B)',
            cpcbAuth: 'CPCB/BMWM/2026/KA-9401',
            timestamp: timeStr,
            totalWeightKg: parseFloat(totalKg.toFixed(2)),
            totalItems: totalItems,
            breakdown: {
              YELLOW: `${yellowKg.toFixed(2)} kg (${parsed.YELLOW.itemCount || 0} items)`,
              RED: `${redKg.toFixed(2)} kg (${parsed.RED.itemCount || 0} items)`,
              BLUE: `${blueKg.toFixed(2)} kg (${parsed.BLUE.itemCount || 0} items)`,
              WHITE: `${whiteKg.toFixed(2)} kg (${parsed.WHITE.itemCount || 0} items)`
            }
          });

          setTruckScaleKg(parseFloat(totalKg.toFixed(2)));
        } catch (err) {
          console.error('Error parsing saved bin states:', err);
        }
      }
    }
  }, []);

  // Calculate weight delta variance
  const bedsideKg = scannedData ? scannedData.totalWeightKg : 0;
  const weightDelta = Math.abs(truckScaleKg - bedsideKg);
  const isDiscrepancy = weightDelta > 0.5;

  // Generate Receipt QR Code on complete
  useEffect(() => {
    if (handoverComplete) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

      const payload = JSON.stringify({
        transferReceiptId: 'CBWTF-RC-9941',
        manifestId: scannedData?.manifestId,
        verifiedWeightKg: truckScaleKg,
        driver: driverName,
        signee: hospitalSignee,
        timestamp: new Date().toISOString()
      });

      QRCode.toDataURL(payload, { width: 160, margin: 1 })
        .then(url => setReceiptQrUrl(url))
        .catch(err => console.error('Receipt QR error:', err));
    }
  }, [handoverComplete, scannedData, truckScaleKg, driverName, hospitalSignee]);

  // Simulate vehicle movement along GPS route
  useEffect(() => {
    const timer = setInterval(() => {
      setTransitProgress(prev => (prev >= 100 ? 10 : prev + 2));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleConfirmHandover = () => {
    setHandoverComplete(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Fleet Telemetry Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-wide">
                CBWTF Waste Logistics & Fleet Handover Portal
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                VEHICLE #KA-01-MW-9401
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Authorized Common Bio-medical Waste Treatment Facility Transit & Weighbridge Verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>ETA to Incinerator:</span>
            <span className="text-cyan-300 font-bold">18 Mins</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            CPCB Chain of Custody Active
          </div>
        </div>
      </div>

      {/* Main Logistics Grid (Left: Manifest Scan & Weighbridge; Right: GPS Transit Route) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (col-span-6): Manifest Verification & Weighbridge Reconciler */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Card 1: Scanned Bedside Form-IV Manifest */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Scanned Ward Form-IV Manifest
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                VERIFIED QR
              </span>
            </div>

            {scannedData ? (
              <div className="flex flex-col gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Manifest Serial:</span>
                  <span className="text-cyan-300 font-bold">{scannedData.manifestId}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Healthcare Facility:</span>
                  <span className="text-white font-bold">{scannedData.facility}</span>
                </div>

                {/* Category Weight Breakdown List */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="p-2.5 rounded-lg bg-yellow-950/20 border border-yellow-500/30 flex justify-between">
                    <span className="text-yellow-400 font-bold">🟡 Yellow:</span>
                    <span className="text-slate-200">{scannedData.breakdown.YELLOW}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/30 flex justify-between">
                    <span className="text-red-400 font-bold">🔴 Red:</span>
                    <span className="text-slate-200">{scannedData.breakdown.RED}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/30 flex justify-between">
                    <span className="text-blue-400 font-bold">🔵 Blue:</span>
                    <span className="text-slate-200">{scannedData.breakdown.BLUE}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-300/30 flex justify-between">
                    <span className="text-slate-200 font-bold">⚪ White:</span>
                    <span className="text-slate-200">{scannedData.breakdown.WHITE}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No manifest scanned yet.</p>
            )}
          </div>

          {/* Card 2: Weighbridge Scale Reconciliation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Truck Weighbridge Scale Reconciler
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-400">Bedside Logged Weight:</span>
                  <span className="text-lg font-bold text-cyan-300">{bedsideKg.toFixed(2)} kg</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-400">Truck Scale Reading (kg):</span>
                  <input
                    type="number"
                    step="0.05"
                    value={truckScaleKg}
                    onChange={(e) => setTruckScaleKg(parseFloat(e.target.value) || 0)}
                    className="bg-slate-900 border border-slate-700 text-white font-bold text-lg rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Variance Indicator Badge */}
              <div className={`p-3 rounded-lg border flex items-center justify-between ${
                isDiscrepancy
                  ? 'bg-red-950/40 border-red-500 text-red-200'
                  : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isDiscrepancy ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  <div>
                    <span className="font-bold">
                      {isDiscrepancy ? 'WEIGHT DISCREPANCY ALERT!' : 'WEIGHT RECONCILED MATCH'}
                    </span>
                    <p className="text-[11px] opacity-80">
                      Delta: {weightDelta.toFixed(2)} kg ({((weightDelta / bedsideKg) * 100).toFixed(1)}% variance)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (col-span-6): Live GPS Transit Fleet Simulator & Handover Sign-off */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* GPS Route Map Simulation Canvas */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Transport Fleet GPS Route
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                Speed: 42 km/h
              </span>
            </div>

            {/* Interactive Route Canvas Visual */}
            <div className="relative h-44 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden p-4 flex flex-col justify-between">
              {/* Waypoint 1: Hospital */}
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span>Kasturba Hospital Ward Loading Bay</span>
                </div>
                <span className="text-slate-500">Origin (00 km)</span>
              </div>

              {/* Progress Line */}
              <div className="relative w-full h-3 bg-slate-900 rounded-full border border-slate-800 my-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-1000"
                  style={{ width: `${transitProgress}%` }}
                />
              </div>

              {/* Waypoint 2: CBWTF Treatment Plant */}
              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-900">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>Central CBWTF Incineration Plant</span>
                </div>
                <span className="text-slate-400">Destination (14.2 km)</span>
              </div>
            </div>
          </div>

          {/* Dual Signature & Transfer Receipt */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Chain-of-Custody Sign-off & Transfer Receipt
                </h3>
              </div>
            </div>

            {!handoverComplete ? (
              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400">CBWTF Vehicle Driver:</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-white rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400">Hospital Signee:</label>
                    <input
                      type="text"
                      value={hospitalSignee}
                      onChange={(e) => setHospitalSignee(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-white rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConfirmHandover}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Award className="w-4 h-4" />
                  Issue Sealed Digital CBWTF Transfer Receipt
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {receiptQrUrl && (
                    <img src={receiptQrUrl} alt="Transfer Receipt QR" className="w-20 h-20 rounded border border-slate-700 bg-white p-1" />
                  )}
                  <div className="flex flex-col gap-1 text-xs font-mono">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      HANDOVER CERTIFICATE ISSUED
                    </span>
                    <p className="text-white font-bold">Receipt #CBWTF-RC-9941</p>
                    <p className="text-[11px] text-slate-400">Verified Payload: {truckScaleKg.toFixed(2)} kg</p>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg hover:bg-slate-800 transition-all"
                >
                  Print Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
