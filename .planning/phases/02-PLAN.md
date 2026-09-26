# Phase 2 Plan: MediTrace Logistics & CBWTF Handover Portal

## Objective
Build and integrate **MediTrace Logistics**, enabling CBWTF transport vehicle operators to scan ward CPCB Form-IV QR codes, reconcile weighbridge scale deltas, track live GPS fleet routes, and issue digital chain-of-custody transfer receipts.

---

## Tasks

### Task 1: Navigation Header Extension (`app/layout.tsx` & Navigation Bar)
- Add view switcher tabs to header: **"Bedside Trolley OS"** vs **"CBWTF Logistics Portal"**.
- Enable seamless navigation between the bedside segregation dashboard (`/`) and logistics portal (`/logistics`).

### Task 2: CBWTF QR Handover & Weighbridge Reconciliation (`components/CBWTFHandoverPortal.tsx`)
- Build Form-IV QR Code Scanner input (camera capture + manual JSON code paste).
- Build Weight Reconciliation Calculator comparing Bedside logged weight vs Truck Weighbridge scale.
- Render Discrepancy Alert badge if payload variance exceeds statutory threshold.

### Task 3: GPS Fleet Route & Transport Transit Simulator
- Build animated map canvas showing vehicle transit route from Kasturba Healthcare Ward 4B $\rightarrow$ CBWTF Incineration Facility.
- Display vehicle telemetry: License Plate `KA-01-MW-9401`, Speed ($42\text{ km/h}$), Transit Temp ($22^\circ\text{C}$), and Live ETA.

### Task 4: Digital Transfer Certificate & Verification
- Build dual sign-off section for Hospital Waste Manager and CBWTF Vehicle Driver.
- Output printable CBWTF Chain-of-Custody Handover Certificate with verification hash.
