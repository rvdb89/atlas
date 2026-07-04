/**
 * Doughbert Standards — reference ranges for Test Kitchen validation.
 * Replaceable without changing agent orchestration.
 */
export const DOUGHBERT_STANDARDS_VERSION = "2026.07";

export type FlourHydrationRange = {
  label: string;
  min: number;
  idealMin: number;
  idealMax: number;
  max: number;
  beginnerMax: number;
};

export const FLOUR_HYDRATION_RANGES: Record<string, FlourHydrationRange> = {
  t65: {
    label: "T65",
    min: 65,
    idealMin: 68,
    idealMax: 78,
    max: 85,
    beginnerMax: 80,
  },
  t80: {
    label: "T80",
    min: 68,
    idealMin: 70,
    idealMax: 80,
    max: 88,
    beginnerMax: 82,
  },
  "tipo-00": {
    label: "Tipo 00",
    min: 55,
    idealMin: 60,
    idealMax: 70,
    max: 75,
    beginnerMax: 68,
  },
  tipo00: {
    label: "Tipo 00",
    min: 55,
    idealMin: 60,
    idealMax: 70,
    max: 75,
    beginnerMax: 68,
  },
  volkoren: {
    label: "Volkoren",
    min: 75,
    idealMin: 78,
    idealMax: 90,
    max: 95,
    beginnerMax: 88,
  },
  default: {
    label: "Tarwebloem",
    min: 60,
    idealMin: 65,
    idealMax: 75,
    max: 85,
    beginnerMax: 78,
  },
};

export const SALT_PERCENT = {
  idealMin: 1.8,
  idealMax: 2.2,
  warnMin: 1.5,
  warnMax: 2.5,
};

export const STARTER_PERCENT = {
  idealMin: 10,
  idealMax: 25,
  warnMin: 8,
  warnMax: 30,
};

export const BULK_HOURS_AT_24C = {
  min: 2,
  idealMin: 3,
  idealMax: 8,
  warnMax: 12,
};

export const COLD_PROOF_HOURS = {
  min: 4,
  idealMin: 8,
  idealMax: 24,
};

export const DOUGH_TEMP_C = {
  idealMin: 24,
  idealMax: 26,
};

export const BAKING_SCORE_PASS_THRESHOLD = 75;

export const REQUIRED_TERMINOLOGY = [
  "hydratatie",
  "fermentatie",
  "starter",
  "deeg",
] as const;
