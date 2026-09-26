# Phase 1 Plan: MediTrace OS (KIT26038) Complete System Implementation

## Objective
Build and deploy the complete **MediTrace OS (KIT26038)** web application — including Next.js scaffold, AI Vision API route, IoT Mobile Cart Digital Twin with active interlocks & Web Audio mismatch alarm, and CPCB Form-IV digital audit manifest engine with QR code serialization.

---

## Tasks

### Task 1: Next.js Application Scaffold & Design System
- **Files**:
  - `package.json`
  - `next.config.js` / `next.config.mjs`
  - `tsconfig.json`
  - `app/layout.tsx`
  - `app/globals.css`
- **Steps**:
  1. Initialize Next.js project structure with TypeScript support.
  2. Install required npm packages: `lucide-react`, `qrcode`, `@google/genai`, `canvas-confetti`, `clsx`.
  3. Define custom BMWM 2016 theme variables in `app/globals.css`:
     - Yellow Bin: `#EAB308` (Infectious/Soiled)
     - Red Bin: `#EF4444` (Contaminated Plastics)
     - Blue Bin: `#3B82F6` (Glassware)
     - White Bin: `#F8FAFC` (Sharps Puncture-proof)
  4. Create glassmorphism cards, glowing status rings, and red emergency screen flashing keyframe animations.

### Task 2: AI Classification API Route & Demo Presets (`app/api/classify/route.ts`)
- **Files**:
  - `app/api/classify/route.ts`
  - `lib/types.ts`
  - `lib/presets.ts`
- **Steps**:
  1. Define TypeScript interfaces for waste classification result, telemetry state, and manifest data.
  2. Build API route `app/api/classify/route.ts` accepting base64 image data.
  3. Integrate Gemini Vision API via prompt enforcing strict BMWM 2016 categorization into Yellow, Red, Blue, or White bins with pathogen risk, treatment method, recyclability score, and English/Hindi audio voice directives.
  4. Create static demo preset dictionary for instant offline verification:
     - **Adult Diaper**: Yellow (Incineration, 0% recyclable)
     - **IV Tubing**: Red (Autoclave, 95% recyclable)
     - **Glass Ampoule**: Blue (Chemical Disinfection)
     - **Needle / Scalpel**: White (Sharps Puncture-proof)

### Task 3: IoT Cart Digital Twin & Active Interlock GUI (`app/page.tsx`)
- **Files**:
  - `app/page.tsx`
  - `components/CameraScanner.tsx`
  - `components/CartDigitalTwin.tsx`
  - `lib/audio.ts` (Web Audio API siren oscillator & Web Speech API TTS player)
- **Steps**:
  1. Build two-column responsive desktop/mobile grid in `app/page.tsx`.
  2. **Left Column**:
     - Live webcam stream with capture button using HTML5 `video` & `canvas`.
     - File upload dropzone fallback.
     - 4 Quick-Test Demo Preset buttons (*Adult Diaper*, *IV Tubing*, *Glass Ampoule*, *Needle*).
     - Result banner featuring BMWM color badge, pathogen level, treatment instructions, and dual-language audio trigger button.
  3. **Right Column**:
     - Interactive 4-Compartment Digital Twin Cart showing load-cell weight (kg) and fill levels (%).
     - **Dynamic Interlocks**: Selected target bin displays glowing green `LID: UNLOCKED` badge; remaining 3 display red `INTERLOCKED / LOCKED` badge.
     - **Mismatch Alarm Engine**: "Simulate Mismatch" toggle button triggering emergency red screen flash, 880Hz audio siren oscillator, and spoken warning prompt.

### Task 4: CPCB Form-IV Digital Manifest Modal (`components/CPCBManifestModal.tsx`)
- **Files**:
  - `components/CPCBManifestModal.tsx`
  - `lib/manifest.ts`
- **Steps**:
  1. Build "Seal Batch / Close Shift" header trigger button.
  2. Create modal dialog rendering official CPCB Form-IV layout:
     - Ward ID: *Kasturba Healthcare & Research Institute (Ward 4B)*
     - Category breakdown: Total items & weight (kg) for Yellow, Red, Blue, and White bins.
     - Total shift waste payload (kg).
     - Canvas rendering scannable serialization QR code via `qrcode` package.
     - Print / Export PDF feature trigger.

### Task 5: Verification & End-to-End Build Test
- **Steps**:
  1. Build project using `npm run build`.
  2. Verify clean compilation with zero TypeScript errors.
  3. Validate all acceptance criteria from `01-SPEC.md`.

---

## Acceptance Criteria
- [ ] Next.js app builds cleanly with zero errors.
- [ ] `/api/classify` handles image analysis & preset fallbacks returning valid BMWM 2016 JSON.
- [ ] Left column scanner webcam & 4 preset buttons accurately classify waste.
- [ ] Right column Cart Digital Twin reflects real-time weight changes and updates interlock states (`UNLOCKED` target bin, `LOCKED` non-target bins).
- [ ] "Simulate Mismatch" button flashes red emergency screen & plays Web Audio siren.
- [ ] "Seal Batch / Close Shift" modal opens displaying CPCB Form-IV compliance fields and scannable QR code.
