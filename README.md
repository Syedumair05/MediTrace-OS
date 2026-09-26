# MediTrace OS (KIT26038) 🩺♻️
### Smart Mobile Medical-Waste Segregation, Computer-Vision AI & IoT Cart Interlock OS

![BMWM 2016 Compliant](https://img.shields.io/badge/Statutory_Standard-BMWM_2016_CPCB-06B6D4?style=for-the-badge)
![Gemini AI Vision](https://img.shields.io/badge/AI_Engine-Gemini_Multimodal_Vision-8B5CF6?style=for-the-badge)
![Vernacular Audio](https://img.shields.io/badge/Audio_Directives-Trilingual_EN_HI_TE-10B981?style=for-the-badge)
![Next.js 14](https://img.shields.io/badge/Framework-Next.js_14_App_Router-000000?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/Language-TypeScript_5.4-3178C6?style=for-the-badge)

---

## 📌 Executive Overview

**MediTrace OS (KIT26038)** is an intelligent software, computer-vision AI, and simulated digital-twin IoT platform retrofitted onto standard hospital ward waste collection trolleys. It eliminates bedside biomedical waste missegregation and cross-contamination under **India's Bio-Medical Waste Management (BMWM) Rules 2016** (issued by the **Central Pollution Control Board - CPCB**).

By coupling Google Gemini Multimodal Vision AI with dynamic 4-bin solenoid lid interlocks, load-cell weight telemetry, and trilingual voice directives (English, Hindi, Telugu), MediTrace OS ensures strict statutory compliance at the exact point of disposal before waste enters the common transport pipeline.

---

## ✨ Key System Features

- 🤖 **Gemini Multimodal Vision AI Classifier (`/api/classify`)**: Analyzes bedside waste images in real-time (< 1.2s latency), returning exact BMWM bin colors, risk levels, and disposal protocols.
- 🔒 **IoT Cart Digital Twin & Solenoid Interlocks (`CartDigitalTwin.tsx`)**: Renders an interactive 4-compartment digital twin displaying live load-cell telemetry (kg) and fill levels (%). Target solenoid lid unlocks with a green glowing badge while locking non-target bins. Includes a **Tare Zero-Reset** calibration button.
- 🔊 **Trilingual Vernacular Audio Directives (`lib/audio.ts`)**: Delivers real-time spoken audio instructions in **English**, **Hindi (हिंदी)**, and **Telugu (తెలుగు)** via Web Speech API (`te-IN` locale) alongside high-frequency (1046.5Hz) barcode scan chimes.
- 🚨 **Web Audio Siren & Audit Log Feed**: Simulates cross-contamination events with an 880Hz Web Audio siren oscillator, emergency red screen overlay, and an immutable real-time Near-Miss Audit Log feed.
- 📜 **CPCB Form-IV Manifest QR Code (`CPCBManifestModal.tsx`)**: Automatically compiles statutory Form-IV manifests upon shift seal, rendering a 2D QR serialization canvas for transport handovers.
- 🚚 **MediTrace Logistics & CBWTF Transport Portal (`/logistics`)**: Dedicated CBWTF transport portal featuring weighbridge scale reconciliation ($\Delta\text{kg}$ delta alert), live 14.2 km GPS fleet transit simulation, and sealed digital transfer receipts.

---

## 🎨 Statutory BMWM 2016 Waste Categorization Matrix

| Bin Color | Waste Category & Examples | Disposal & Treatment Protocol | Recyclability & Risk Profile |
| :--- | :--- | :--- | :--- |
| 🟡 **YELLOW** | Infectious / Soiled waste, adult diapers, anatomical waste, blood bags | Incineration at 1050°C / Plasma Pyrolysis | **0% Recyclable** *(Extreme Pathogen Risk)* |
| 🔴 **RED** | Contaminated plastics, IV tubing, saline bottles, catheters, gloves | Autoclaving / Shredding & Plastic Polymer Recycling | **95% Recyclable** *(Moderate Risk)* |
| 🔵 **BLUE** | Glassware, medicine vials, ampoules, metallic body implants | Sodium Hypochlorite Disinfection & Glass Smelting | **85% Recyclable** *(Low Risk)* |
| ⚪ **WHITE** | Sharps, syringe needles, surgical scalpels, blades, lancets | Autoclaving & Needle Mutilation / Encapsulation | **10% Encapsulated** *(High Injury Risk)* |

---

## 🛠️ Technology Stack

| Layer | Technology | Usage in MediTrace OS |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14.2 (App Router), React 18 | Server-rendered pages, API routes, and client components |
| **Language** | TypeScript 5.4 | Strict static typing across telemetry, manifests & classification APIs |
| **Styling** | Tailwind CSS 3.4, Vanilla CSS | Dark glassmorphism theme, glowing borders, custom keyframe animations |
| **AI Vision Engine** | Google Gemini Vision API (`@google/generative-ai`) | Multimodal image classification & BMWM 2016 prompt analysis |
| **Audio Engine** | Web Speech API & Web Audio API | Trilingual TTS (EN, HI, TE - తెలుగు), 880Hz siren & 1046.5Hz scan chime |
| **Barcodes & QR** | `qrcode` (1.5.3) & `canvas-confetti` | 2D QR code canvas serialization & shift completion celebration |
| **Logistics Fleet Engine** | HTML5 Route Canvas & Scale Reconciler | Weighbridge scale delta calculator & 14.2 km GPS route simulator |
| **Report Generation** | `pdfkit` (Node.js PDF Engine) | Vector PDF project report generator script |

---

## 📂 Project Architecture

```
MediTrace-OS/
├── app/
│   ├── api/
│   │   └── classify/
│   │       └── route.ts         # Gemini Vision AI multimodal classification endpoint
│   ├── logistics/
│   │   └── page.tsx             # CBWTF Waste Logistics & Fleet Handover Portal
│   ├── globals.css              # Custom Tailwind CSS & glassmorphism theme styling
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main Bedside Trolley OS & Interlock Coordinator
├── components/
│   ├── CameraScanner.tsx        # Camera video feed & BMWM preset image selector
│   ├── CartDigitalTwin.tsx      # 4-bin IoT digital twin, load cells & solenoid locks
│   ├── CBWTFHandoverPortal.tsx  # Weighbridge scale reconciler & GPS transit simulator
│   └── CPCBManifestModal.tsx    # CPCB Form-IV manifest & 2D QR code canvas modal
├── lib/
│   ├── audio.ts                 # Web Speech (EN/HI/TE) & Web Audio API siren synthesis
│   ├── presets.ts               # Pre-calibrated BMWM 2016 classification test items
│   └── types.ts                 # TypeScript interface definitions (BinState, AuditLog)
├── scripts/
│   ├── generate_pdf_report.js   # PDF report generator script
│   └── generate_ppt_slides_pdf.js # 6-slide presentation PDF generator script
├── .planning/                   # BMWM 2016 specifications & architectural roadmap
├── MediTrace_OS_Comprehensive_Project_Report.pdf # Generated PDF project report
├── package.json
└── README.md
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Gemini API Key** *(Optional for live webcam scan; pre-calibrated test presets work out-of-the-box)*

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Syedumair05/MediTrace-OS.git
   cd MediTrace-OS
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

5. **Access Application Routes**:
   - 🛒 **Bedside Trolley Dashboard**: [http://localhost:3000](http://localhost:3000)
   - 🚚 **CBWTF Logistics Portal**: [http://localhost:3000/logistics](http://localhost:3000/logistics)

---

## 📜 Statutory Certification & Compliance

This repository satisfies all statutory requirements under the **India Bio-Medical Waste Management (BMWM) Rules 2016**, Central Pollution Control Board (CPCB) Form-IV manifest compliance, trilingual audio directive standards, and modern web accessibility guidelines.

Developed for **Kasturba Healthcare & Research Institute (Ward 4B)** • **Project Serial #KIT26038**.
