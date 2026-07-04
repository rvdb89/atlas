export type QualityDimension =
  | "editorial"
  | "technical"
  | "seo"
  | "accessibility"
  | "consistency"
  | "completeness"
  | "domain";

export type QualityScoreEntry = {
  contentId: string;
  overall: number;
  dimensions: Partial<Record<QualityDimension, number>>;
  source: "ai" | "validation" | "manual" | "aggregated";
  recordedAt: string;
  moduleId?: string;
};

export type QualityScoresReport = {
  generatedAt: string;
  entries: QualityScoreEntry[];
  platformAverage: number;
  distribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
};

export type QualityScoreProvider = {
  moduleId: string;
  getScores(): QualityScoreEntry[];
};
