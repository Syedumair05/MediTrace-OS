# Bio-Medical Waste Management (BMWM) Rules 2016 - Technical & Compliance Research

## 1. CPCB India Bin Color Coding Matrix
| Bin Color | Waste Category | Examples | Treatment / Disposal Method |
| :--- | :--- | :--- | :--- |
| **Yellow** | Human Anatomical, Soiled, Expired Drugs, Chemical Waste | Tissues, organs, blood-soaked cotton, expired antibiotics, cytotoxic drugs | Incineration or Plasma Pyrolysis / Deep burial |
| **Red** | Contaminated Recyclable Plastics | Disposable IV bottles, catheters, tubing, gloves, urine bags, syringes without needles | Autoclaving/Microwaving followed by shredding |
| **Blue** | Glassware & Metallic Implants | Medicine vials, ampoules, glass slides, metal implants, surgical wires | Disinfection (soaking in sodium hypochlorite) or Autoclaving then recycling |
| **White (Translucent)** | Waste Sharps (Puncture-Proof) | Needles, syringes with fixed needles, scalpels, blades, lancets | Autoclaving/Dry heat sterilization followed by shredding / encapsulation |

---

## 2. IoT Cart Digital Twin Architecture
- **Weight Telemetry (Load Cells)**:
  - 4 independent weight sensors sampling at 10Hz.
  - Tare calibration on shift start.
  - Weight trigger threshold detection (+5g shift triggers log entry).
- **Interlock Actuators**:
  - Servo/Solenoid lock states: `LOCKED` (0), `UNLOCKED` (1).
  - Safety default: All bins remain `LOCKED` until AI classification succeeds or manual override key is turned.
- **Cross-Contamination Detector Logic**:
  - If weight increases in Bin X while Bin Y was unlocked, flag `CROSS_CONTAMINATION_ALERT`.

---

## 3. CPCB Form-IV Manifest Schema
Required fields for Form-IV Annual & Shift Compliance:
1. Facility Name & CPCB Authorization No.
2. Healthcare Unit / Ward ID.
3. Date & Time of Dispatch.
4. Waste Category Breakdown (Weight in kg for Yellow, Red, Blue, White).
5. Number of Bags/Containers per Color Code.
6. CBWTF Operator ID & Handover Vehicle Number.
7. Verification Hash & QR Serialization Code.
