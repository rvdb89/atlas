export type RecommendationKind =
  | "content"
  | "quality"
  | "learning"
  | "editorial"
  | "platform"
  | "maintenance";

export type RecommendationPriority = "low" | "medium" | "high";

export type Recommendation = {
  id: string;
  kind: RecommendationKind;
  title: string;
  description: string;
  priority: RecommendationPriority;
  targetId?: string;
  actionLabel?: string;
  generatedAt: string;
  moduleId?: string;
  expiresAt?: string;
};

export type RecommendationReport = {
  generatedAt: string;
  recommendations: Recommendation[];
  topPriority: Recommendation[];
};
