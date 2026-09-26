export type BinCategory = 'YELLOW' | 'RED' | 'BLUE' | 'WHITE';

export interface VoiceDirectives {
  en: string;
  hi: string;
  te: string;
}

export interface WasteClassificationResult {
  item_name: string;
  bin_category: BinCategory;
  bin_label: string;
  treatment_method: string;
  pathogen_risk: 'Extreme' | 'High' | 'Moderate' | 'Low';
  recyclability_percent: number;
  reasoning: string;
  estimated_weight_kg: number;
  voice_directives: VoiceDirectives;
}

export interface BinState {
  category: BinCategory;
  name: string;
  color: string;
  bgGradient: string;
  borderGlow: string;
  currentWeightKg: number;
  capacityKg: number;
  itemCount: number;
  isUnlocked: boolean;
  treatment: string;
  recyclability: number;
  iconName: string;
}

export interface ShiftManifest {
  manifestId: string;
  facilityName: string;
  wardId: string;
  timestamp: string;
  operatorId: string;
  totalWeightKg: number;
  totalItems: number;
  breakdown: Record<BinCategory, { weightKg: number; items: number; label: string; treatment: string }>;
  cbwtfHash: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  type: 'MISMATCH_ALARM' | 'CLASSIFICATION' | 'WEIGHT_ADDITION' | 'BATCH_SEALED';
  level: 'CRITICAL' | 'COMPLIANT' | 'INFO';
  title: string;
  details: string;
}

export interface DemoPreset {
  id: string;
  label: string;
  sublabel: string;
  imagePrompt: string;
  imageUrl: string;
  result: WasteClassificationResult;
  svgIcon: string;
}
