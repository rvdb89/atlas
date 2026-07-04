import { registerContentCatalogProvider } from "@/atlas/intelligence/content-gaps/store";
import type { ContentCatalogSnapshot } from "@/atlas/intelligence/content-gaps/types";
import { registerContentHealthProvider } from "@/atlas/intelligence/content-health/store";
import type { ContentHealthEntry } from "@/atlas/intelligence/content-health/types";
import { registerLearningPathProvider } from "@/atlas/intelligence/learning-paths/store";
import type { LearningPath } from "@/atlas/intelligence/learning-paths/types";
import { registerQualityScoreProvider } from "@/atlas/intelligence/quality-scores/store";
import type { QualityScoreEntry } from "@/atlas/intelligence/quality-scores/types";
import { collectKnowledgeArticleInputs } from "@/modules/doughbert/knowledge/collectSources";
import { DOUGHBERT_CATEGORY_PRESETS } from "@/modules/doughbert/studio/categoryPresets";

const EXPECTED_TOPICS = Object.values(DOUGHBERT_CATEGORY_PRESETS).flatMap((preset) => preset.topics);

export function registerDoughbertIntelligenceProviders(): void {
  registerContentCatalogProvider({
    moduleId: "doughbert",
    getSnapshot(): ContentCatalogSnapshot {
      const articles = collectKnowledgeArticleInputs();
      return {
        topics: articles.map((article) => article.title),
        categoryIds: [...new Set(articles.map((article) => article.categoryId))],
        contentTypes: [...new Set(articles.map(() => "article"))],
        slugs: articles.map((article) => article.slug),
      };
    },
    getExpectedTopics() {
      return EXPECTED_TOPICS;
    },
  });

  registerQualityScoreProvider({
    moduleId: "doughbert",
    getScores(): QualityScoreEntry[] {
      return collectKnowledgeArticleInputs().map((article) => ({
        contentId: article.slug,
        overall: article.status === "published" ? 88 : 72,
        dimensions: {
          editorial: 85,
          completeness: article.content?.sections?.length ? 80 : 65,
          domain: 82,
        },
        source: "aggregated",
        recordedAt: new Date().toISOString(),
        moduleId: "doughbert",
      }));
    },
  });

  registerContentHealthProvider({
    moduleId: "doughbert",
    assessContent(): ContentHealthEntry[] {
      return collectKnowledgeArticleInputs().map((article) => {
        const hasSections = (article.content?.sections?.length ?? 0) > 0;
        const score = hasSections ? 86 : 68;
        return {
          contentId: article.slug,
          title: article.title,
          status: score >= 85 ? "healthy" : score >= 70 ? "attention" : "at-risk",
          score,
          issues: hasSections
            ? []
            : [{ code: "thin-content", message: "Artikel heeft weinig secties.", severity: "warning" }],
          lastAssessedAt: new Date().toISOString(),
          moduleId: "doughbert",
        };
      });
    },
  });

  registerLearningPathProvider({
    moduleId: "doughbert",
    buildPaths(): LearningPath[] {
      const starterPreset = DOUGHBERT_CATEGORY_PRESETS.starter;
      if (!starterPreset) return [];

      return [
        {
          id: "doughbert-starter-path",
          title: "Starten met zuurdesem",
          description: "Een gefaseerde leerroute voor Doughbert-beginners.",
          difficulty: "beginner",
          tags: ["starter", "beginner"],
          moduleId: "doughbert",
          generatedAt: new Date().toISOString(),
          steps: starterPreset.topics.slice(0, 4).map((topic, index) => ({
            id: `starter-step-${index}`,
            contentId: topic.toLowerCase().replace(/\s+/g, "-"),
            title: topic,
            order: index + 1,
            estimatedMinutes: 10,
          })),
        },
      ];
    },
  });
}
