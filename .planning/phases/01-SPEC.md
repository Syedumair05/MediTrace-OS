# MediTrace OS (KIT26038) - Phase 1 Architectural & Functional Specification (SPEC.md)

## 1. Executive Summary & Objective
**MediTrace OS** (KIT26038) is an intelligent software, computer-vision, and simulated digital-twin IoT system designed to retrofit onto standard hospital trolleys. Its primary objective is to eliminate bedside cross-contamination and enforce strict statutory compliance under India's **Biomedical Waste Management (BMWM) Rules 2016** (Central Pollution Control Board - CPCB).

---

## 2. Statutory BMWM 2016 Color Bin Matrix & Rules

| Bin Color | Waste Category & Examples | Disposal & Treatment Directive | Recyclability & Risk Profile |
| :--- | :--- | :--- | :--- |
| 🟡 **Yellow** | Infectious anatomical waste, soiled cotton, adult diapers, anatomical tissue, expired drugs | High-temperature Incineration (1050°C) or Plasma Pyrolysis | **0% Recyclable** due to extreme pathogen risk |
| 🔴 **Red** | Contaminated plastics: IV tubing, saline bottles, catheters, syringes without needle | Autoclave sterilization followed by shredding | **95% Recyclable** post-sterilization |
| 🔵 **Blue** | Glassware: Glass vials, medicine ampoules, glass slides, metallic implants | Sodium hypochlorite chemical disinfection & glass smelting | High glass recycling yield |
| ⚪ **White (Translucent)** | Sharps: Needles, scalpels, surgical blades, burnished pins | Puncture-proof container, mutilation & encapsulation | Encapsulated non-hazardous scrap |

---

## 3. System Architecture & Components

```
+-----------------------------------------------------------------------------------+
|                                  MediTrace OS GUI                                 |
|                                    (app/page.tsx)                                 |
+----------------------------------------+------------------------------------------+
|  LEFT COLUMN: Scanner & Presets        |  RIGHT COLUMN: IoT Cart Digital Twin     |
|  - Live Webcam Viewfinder / Capture    |  - 4-Compartment Live Telemetry (kg/%)   |
|  - File Upload Fallback                |  - Dynamic Interlock (LID UNLOCKED/LOCKED)|
|  - 4 Presets (Diaper, Tubing, Ampoule, |  - Mismatch Alarm Engine (Web Audio API) |
|    Needle)                             |  - "Seal Batch / Close Shift" Trigger    |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     | API Route: app/api/classify/route.ts  |
                     | - Gemini Multimodal Vision Integration|
                     | - BMWM 2016 Classification Prompt     |
                     | - Dual Language Speech Directive (EN/HI)|
                     +---------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     | CPCB Form-IV Digital Manifest Modal   |
                     | - QR Code Serialization (qrcode pkg)  |
                     | - Category Weight Summaries           |
                     | - CBWTF Handover Hash                 |
                     +---------------------------------------+
```

---

## 4. Detailed Technical Specifications

### 4.1 Module 1: AI Scanner Engine (`app/api/classify/route.ts`)
- **Input**: Base64 image payload (from webcam capture, file upload, or preset image).
- **Gemini API Integration**: Uses `@google/genai` or standard Gemini REST endpoint with structured JSON response schema.
- **Output Schema**:
  ```typescript
  interface WasteClassificationResult {
    item_name: string;
    bin_category: "YELLOW" | "RED" | "BLUE" | "WHITE";
    bin_label: string;
    treatment_method: string;
    pathogen_risk: "Extreme" | "High" | "Moderate" | "Low";
    recyclability_percent: number;
    reasoning: string;
    voice_directives: {
      en: string;
      hi: string;
    };
  }
  ```
- **Fallback / Demo Presets**:
  1. *Adult Diaper / Soiled Cotton*: 🟡 Yellow (Incineration, 0% recyclable). Voice: EN: "Drop in Yellow infectious bin." / HI: "पीले संक्रामक डिब्बे में डालें।"
  2. *IV Tubing / Saline Bottle*: 🔴 Red (Autoclave, 95% recyclable). Voice: EN: "Drop in Red plastic bin." / HI: "लाल प्लास्टिक डिब्बे में डालें।"
  3. *Glass Ampoule / Vial*: 🔵 Blue (Chemical Disinfection). Voice: EN: "Drop in Blue glassware bin." / HI: "नीले कांच के डिब्बे में डालें।"
  4. *Syringe Needle / Scalpel*: ⚪ White (Sharps Puncture-proof). Voice: EN: "Caution: Sharp item! Place in White translucent container." / HI: "सावधान: नुकीली वस्तु! सफेद पारभासी डिब्बे में रखें।"

### 4.2 Module 2: IoT Cart Digital Twin & Active Interlock GUI (`app/page.tsx`)
- **Layout**: 2-Column Responsive Dashboard (Desktop & Mobile-optimized glassmorphic UI).
- **Left Column**:
  - Live video webcam feed using `navigator.mediaDevices.getUserMedia` with fallback snapshot trigger.
  - Image upload dropzone file fallback.
  - 4 Quick-Test Demo Preset Buttons for immediate demonstration.
  - Active item classification result card featuring pathogen risk badge, treatment instructions, and dual-language Web Speech API audio trigger button.
- **Right Column**:
  - Interactive 4-Compartment Mobile Cart Digital Twin displaying:
    - 🟡 **Yellow Bin**: Weight load cell (kg), fill progress bar (%), lock status indicator.
    - 🔴 **Red Bin**: Weight load cell (kg), fill progress bar (%), lock status indicator.
    - 🔵 **Blue Bin**: Weight load cell (kg), fill progress bar (%), lock status indicator.
    - ⚪ **White Bin**: Weight load cell (kg), fill progress bar (%), lock status indicator.
  - **Dynamic Lid Interlock Behavior**:
    - Target bin lid transitions to **GREEN glowing badge: "LID: UNLOCKED"**.
    - Non-target bins transition to **RED badge: "INTERLOCKED / LOCKED"**.
  - **Mismatch Alarm Engine**:
    - "Simulate Mismatch" toggle button.
    - When active, triggers emergency red flashing screen overlay (`animate-pulse red-screen-flash`).
    - Plays synthesized warning alarm tone via Web Audio API (`AudioContext` oscillator at 880Hz / pulsing siren).
    - Speech alert: "Warning! Missegregation detected in locked bin!".

### 4.3 Module 3: Regulatory CPCB Form-IV Manifest Engine
- **Trigger**: "Seal Batch / Close Shift" button located in cart header.
- **Modal Component**: `CPCBManifestModal.tsx`.
- **Contents**:
  - Facility Name: *Kasturba Healthcare & Research Institute (Ward 4B)*
  - Shift Timestamp & Manifest Serial ID (e.g., `CPCB-2026-0926-8842`)
  - Weight breakdown per category (Yellow kg, Red kg, Blue kg, White kg)
  - Total Shift Volume (kg) & Count of Segregated Items
  - **Scannable QR Code Canvas**: Rendered using `qrcode` npm package encoding JSON serialization payload for CBWTF vehicle handler verification.
  - Print / Export Manifest button.

---

## 5. Technology Stack & Dependencies

- **Framework**: Next.js 14 / 15 (App Router, TypeScript)
- **Styling**: Vanilla CSS with modern Glassmorphism, CSS Variables, and Flexbox/Grid layouts
- **AI Engine**: Gemini Vision API (`@google/genai` SDK or fetch REST API)
- **Audio & Synthesis**: Native browser `window.speechSynthesis` (Web Speech API) + Web Audio API (`AudioContext`)
- **QR Code**: `qrcode` / `qrcode.react` package
- **Icons**: `lucide-react` icons

---

## 6. Falsifiable Acceptance Criteria (Verification Matrix)

| Feature | Test Case | Expected Outcome |
| :--- | :--- | :--- |
| **API Classification** | POST base64 image of IV Tubing to `/api/classify` | Returns `bin_category: "RED"`, `recyclability_percent: 95`, EN & HI voice strings |
| **Preset Action** | Click "Adult Diaper" preset button | Target bin switches to YELLOW, Yellow lid = UNLOCKED, other 3 = LOCKED |
| **Voice Directives** | Classification complete | Spoken directive plays automatically in selected language (EN or HI) |
| **Telemetry Update** | Item added to bin | Target bin weight increases by item payload, fill bar adjusts dynamically |
| **Mismatch Alarm** | Click "Simulate Mismatch" | Red screen flash activates, Web Audio alarm sounds, alert banner displays |
| **CPCB Manifest** | Click "Seal Batch / Close Shift" | Manifest modal opens displaying weight summaries & valid scannable QR code |

---

## 7. Next Steps & Execution Plan
1. Initialize Next.js app in repository with required packages (`lucide-react`, `qrcode`, `@google/genai`).
2. Build custom CSS design system (`app/globals.css`) with BMWM 2016 theme tokens and glassmorphism styling.
3. Build API Route `app/api/classify/route.ts` with Gemini Vision API and robust mock fallback for demo presets.
4. Build `app/page.tsx` responsive dashboard with camera viewfinder, preset trigger bar, and cart digital twin.
5. Implement Web Audio alarm synthesizer and Web Speech API directive player.
6. Build CPCB Form-IV Manifest modal with QR code generation.
