# MediTrace OS - Project Specification

## 1. Overview & Vision
**MediTrace OS** is a cutting-edge, next-generation Smart Mobile Medical-Waste Collection, AI-Assisted Segregation, and CPCB Regulatory Compliance System. Designed for modern healthcare facilities, hospital wards, and CBWTF (Common Bio-medical Waste Treatment Facility) operators, MediTrace OS prevents hazardous cross-contamination at the point of generation, ensures strict adherence to India's **Bio-Medical Waste Management (BMWM) Rules 2016**, and automates digital audit trail reporting.

---

## 2. Core Pillars & Features

### 🟢 Feature 1: Live AI Camera Vision Waste Scanner
- **Gemini Vision AI Engine**: Real-time visual analysis of medical waste objects (e.g., used IV bags, syringes, ampoules, soiled cotton, expired pills, scalpel blades).
- **BMWM 2016 Color Bin Classifier**:
  - 🟡 **Yellow Container**: Human anatomical waste, soiled waste, expired/discarded medicines, chemical waste.
  - 🔴 **Red Container**: Contaminated recyclable plastic waste (tubing, catheters, IV bottles, syringes without needles).
  - 🔵 **Blue Container**: Glassware, medicine ampoules, glass vials, metallic implants.
  - ⚪ **White Translucent Container**: Sharps (needles, syringes with fixed needles, scalpels, blades, burnished pins).
- **Pathogen & Recyclability Assessment**: Displays pathogen risk level (High/Medium/Low), material type, and decontamination requirement.

### 🤖 Feature 2: Simulated IoT Mobile Cart Digital Twin
- **Dynamic Lid Interlock Simulation**: Only the designated bin lid unlocks upon AI verification; non-target lids remain locked to prevent missegregation.
- **Load-Cell Weight Telemetry**: Real-time weight tracking (in grams/kg) for each of the 4 color bins with capacity threshold bars.
- **Cross-Contamination & Mis-binning Detection**: Alerts staff if weight shifts unexpectedly in locked bins or if manual override occurs.

### 🎙️ Feature 3: Multilingual Voice Directive Synthesis
- **Dual Language Support**: Instant spoken directives in **English** and **Hindi** (e.g., *"Drop IV tubing into Red bin"* / *"इस IV ट्यूबिंग को लाल डिब्बे में डालें"*).
- **Audio Cautions for High-Risk Items**: Audible warning chimes and voice alerts when handling sharp or highly bio-hazardous waste.

### 📄 Feature 4: Automated CPCB Form-IV Digital Audit Manifest Engine
- **Shift Completion Manifest**: Aggregates total weight, item counts, and bin distribution per ward/shift.
- **Scannable CPCB QR Code**: Generates a compliance QR code adhering to Central Pollution Control Board (CPCB) barcode/serialization guidelines for CBWTF pickup.
- **Export Capabilities**: PDF/Digital print manifest ready for Infection Control Officer review.

---

## 3. User Personas
1. **Ward Staff & Nurses**: Require quick, error-proof scanning and clear audio/visual guidance during busy shifts.
2. **Infection Control Officer (ICO)**: Needs real-time analytics on ward compliance rates, weight telemetry, and CPCB audit logs.
3. **Bio-Medical Waste Handler / CBWTF Logistics**: Scans manifest QR codes at handover to verify chain of custody and weight accuracy.

---

## 4. Design & Aesthetic Guidelines
- **Palette**: Dark futuristic medical OS interface with vivid color coding matching BMWM 2016 standards:
  - Yellow: `#EAB308` / `#FACC15`
  - Red: `#EF4444` / `#F87171`
  - Blue: `#3B82F6` / `#60A5FA`
  - White Sharps: `#F8FAFC` / `#E2E8F0` (with ice blue ambient glow)
- **Visuals**: Glassmorphism cards, glowing status rings, micro-animations, digital cart HUD canvas, live video viewport overlay.
