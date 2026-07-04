export type TrendDirection = "up" | "down" | "stable" | "unknown";

export type TrendSignal = {
  metricId: string;
  direction: TrendDirection;
  changePercent: number;
  windowLabel: string;
  detectedAt: string;
  moduleId?: string;
};

export type TrendDetectionReport = {
  generatedAt: string;
  trends: TrendSignal[];
  summary: string;
};
