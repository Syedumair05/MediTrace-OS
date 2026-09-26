import { DemoPreset } from './types';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'diaper',
    label: 'Adult Diaper / Soiled Cotton',
    sublabel: 'Anatomical / Soiled Waste',
    imagePrompt: 'Soiled hospital cotton roll and adult diaper with biohazard markings',
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=400&q=80',
    svgIcon: 'FileText',
    result: {
      item_name: 'Soiled Adult Diaper & Cotton Waste',
      bin_category: 'YELLOW',
      bin_label: 'YELLOW CONTAINER (Incineration / Deep Burial)',
      treatment_method: 'High-Temperature Incineration at 1050°C / Plasma Pyrolysis',
      pathogen_risk: 'Extreme',
      recyclability_percent: 0,
      reasoning: 'BMWM 2016 statutory mandate: Soiled waste, diapers, blood-stained cotton, anatomical tissue MUST be incinerated. 0% recyclable due to pathogen risk.',
      estimated_weight_kg: 0.45,
      voice_directives: {
        en: 'Drop soiled cotton and diaper into Yellow infectious bin for high temperature incineration.',
        hi: 'गंदे कॉटन और डाइपर को उच्च तापमान भस्मीकरण के लिए पीले संक्रामक डिब्बे में डालें।',
        te: 'మురికిగా ఉన్న కాటన్ మరియు డైపర్‌ను అధిక ఉష్ణోగ్రత భస్మీకరణ కోసం పసుపు రంగు ఇన్ఫెక్షియస్ డస్ట్ బిన్‌లో వేయండి.'
      }
    }
  },
  {
    id: 'iv_tubing',
    label: 'IV Tubing & Saline Bottle',
    sublabel: 'Contaminated Plastics',
    imagePrompt: 'Transparent plastic IV drip tubing set with medical saline bottle',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80',
    svgIcon: 'Pipette',
    result: {
      item_name: 'Contaminated Plastic IV Tubing Set',
      bin_category: 'RED',
      bin_label: 'RED CONTAINER (Autoclave & Shredding)',
      treatment_method: 'Autoclaving / Microwaving followed by Shredding & Polymer Recycling',
      pathogen_risk: 'Moderate',
      recyclability_percent: 95,
      reasoning: 'BMWM 2016 statutory mandate: Contaminated recyclable plastics (tubing, catheters, IV bottles, syringes without needle) belong in Red container. 95% recyclable post-sterilization.',
      estimated_weight_kg: 0.25,
      voice_directives: {
        en: 'Drop IV tubing and saline bottle into Red recyclable plastics bin.',
        hi: 'आईवी ट्यूबिंग और सेलाइन बोतल को लाल रीसाइक्लिंग प्लास्टिक डिब्बे में डालें।',
        te: 'IV ట్యూబింగ్ మరియు సెలైన్ బాటిల్‌ను ఎరుపు రంగు రీసైక్లింగ్ ప్లాస్టిక్ డస్ట్ బిన్‌లో వేయండి.'
      }
    }
  },
  {
    id: 'glass_ampoule',
    label: 'Glass Ampoule & Vial',
    sublabel: 'Glassware & Metallic Implants',
    imagePrompt: 'Glass medicine vials and cracked ampoules on medical tray',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    svgIcon: 'FlaskConical',
    result: {
      item_name: 'Broken Glass Medicine Ampoules & Vials',
      bin_category: 'BLUE',
      bin_label: 'BLUE CONTAINER (Chemical Disinfection & Smelting)',
      treatment_method: 'Sodium Hypochlorite Chemical Disinfection & Glass Smelting Recycling',
      pathogen_risk: 'Low',
      recyclability_percent: 85,
      reasoning: 'BMWM 2016 statutory mandate: Glassware, medicine ampoules, vials, and metallic implants MUST be segregated into Blue containers for chemical decontamination and glass recycling.',
      estimated_weight_kg: 0.18,
      voice_directives: {
        en: 'Drop glass vial and ampoules into Blue glassware container.',
        hi: 'कांच की शीशी और एम्पाउल्स को नीले कांच वाले डिब्बे में डालें।',
        te: 'గాజు సీసా మరియు యాంపూల్స్‌ను నీలిరంగు గ్లాస్‌వేర్ డస్ట్ బిన్‌లో వేయండి.'
      }
    }
  },
  {
    id: 'needle_scalpel',
    label: 'Syringe Needle & Scalpel',
    sublabel: 'Sharps Puncture-Proof',
    imagePrompt: 'Steel syringe needle fixed tip and surgical scalpel blade',
    imageUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=400&q=80',
    svgIcon: 'Syringe',
    result: {
      item_name: 'Surgical Scalpel & Hypodermic Needle',
      bin_category: 'WHITE',
      bin_label: 'WHITE TRANSLUCENT CONTAINER (Puncture-Proof Sharps)',
      treatment_method: 'Autoclaving & Needle Mutilation / Encapsulation',
      pathogen_risk: 'High',
      recyclability_percent: 10,
      reasoning: 'BMWM 2016 statutory mandate: Needles, scalpels, blades, and burnished pins MUST be deposited in puncture-proof, tamper-evident White translucent container for mutilation.',
      estimated_weight_kg: 0.12,
      voice_directives: {
        en: 'Caution! Sharp object. Deposit needle and scalpel directly into White translucent puncture-proof bin.',
        hi: 'सावधान! नुकीली वस्तु। सुई और स्केलपेल को सीधे सफेद पारभासी डिब्बे में रखें।',
        te: 'జాగ్రత్త! పదునైన వస్తువు. సూది మరియు స్కేల్పెల్‌ను నేరుగా తెలుపు రంగు పంక్చర్-ప్రూఫ్ డస్ట్ బిన్‌లో వేయండి.'
      }
    }
  }
];
