export type LearningPathDifficulty = "beginner" | "intermediate" | "advanced";

export type LearningPathStep = {
  id: string;
  contentId: string;
  title: string;
  order: number;
  estimatedMinutes?: number;
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: LearningPathDifficulty;
  steps: LearningPathStep[];
  tags: string[];
  moduleId?: string;
  generatedAt: string;
};

export type LearningPathsReport = {
  generatedAt: string;
  paths: LearningPath[];
  suggestedNext?: LearningPathStep;
};

export type LearningPathProvider = {
  moduleId: string;
  buildPaths(): LearningPath[];
};
