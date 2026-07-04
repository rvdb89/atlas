import type { IntelligenceAnalyzer } from "../engine/types";
import type { AnalyzerResult, IntelligenceContext } from "../types";
import { getKnowledgeGraph } from "../knowledge-graph/store";
import { getLearningPathProvider, storeLearningPath } from "./store";
import type { LearningPath, LearningPathsReport } from "./types";

export const learningPathsAnalyzer: IntelligenceAnalyzer<LearningPathsReport> = {
  id: "learning-paths.planner",
  category: "learning-paths",
  label: "Learning Path Planner",

  analyze(context): AnalyzerResult<LearningPathsReport> {
    const moduleId = context.scope.moduleId;
    const provider = moduleId ? getLearningPathProvider(moduleId) : undefined;
    const fromProvider = provider?.buildPaths() ?? [];

    for (const path of fromProvider) {
      storeLearningPath(path);
    }

    if (fromProvider.length === 0 && moduleId) {
      const graph = getKnowledgeGraph();
      const contentNodes = graph.nodes.filter((node) => node.type === "content").slice(0, 5);

      if (contentNodes.length >= 2) {
        const autoPath: LearningPath = {
          id: `path-auto-${Date.now()}`,
          title: "Voorgestelde leerroute",
          description: "Automatisch samengesteld op basis van kennisstructuur.",
          difficulty: "beginner",
          tags: ["auto-generated"],
          moduleId,
          generatedAt: context.now,
          steps: contentNodes.map((node, index) => ({
            id: `step-${node.id}`,
            contentId: node.id,
            title: node.label,
            order: index + 1,
            estimatedMinutes: 8,
          })),
        };
        storeLearningPath(autoPath);
        fromProvider.push(autoPath);
      }
    }

    const paths = fromProvider;
    const suggestedNext = paths[0]?.steps[0];

    return {
      analyzerId: "learning-paths.planner",
      category: "learning-paths",
      generatedAt: context.now,
      confidence: paths.length > 0 ? 0.75 : 0.3,
      data: {
        generatedAt: context.now,
        paths,
        suggestedNext,
      },
    };
  },
};
