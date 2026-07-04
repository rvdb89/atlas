export type ContentGapPriority = "low" | "medium" | "high" | "critical";

export type ContentGap = {
  id: string;
  topic: string;
  categoryId?: string;
  contentType?: string;
  reason: string;
  priority: ContentGapPriority;
  suggestedAction: string;
  detectedAt: string;
  moduleId?: string;
};

export type ContentGapReport = {
  generatedAt: string;
  gaps: ContentGap[];
  coverageScore: number;
  missingTopics: string[];
};

export type ContentCatalogSnapshot = {
  topics: string[];
  categoryIds: string[];
  contentTypes: string[];
  slugs: string[];
};

/** Module hook — verticals supply catalog data without coupling Intelligence to domain logic. */
export type ContentCatalogProvider = {
  moduleId: string;
  getSnapshot(): ContentCatalogSnapshot;
  getExpectedTopics?(): string[];
};
