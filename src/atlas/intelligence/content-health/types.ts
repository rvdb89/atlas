export type ContentHealthStatus = "healthy" | "attention" | "at-risk" | "critical";

export type ContentHealthIssue = {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
};

export type ContentHealthEntry = {
  contentId: string;
  title?: string;
  status: ContentHealthStatus;
  score: number;
  issues: ContentHealthIssue[];
  lastAssessedAt: string;
  moduleId?: string;
};

export type ContentHealthReport = {
  generatedAt: string;
  entries: ContentHealthEntry[];
  summary: {
    healthy: number;
    attention: number;
    atRisk: number;
    critical: number;
    averageScore: number;
  };
};

export type ContentHealthProvider = {
  moduleId: string;
  assessContent(): ContentHealthEntry[];
};
