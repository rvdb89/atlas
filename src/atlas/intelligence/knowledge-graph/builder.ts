import type { IntelligenceAnalyzer } from "../engine/types";
import type { AnalyzerResult, IntelligenceContext } from "../types";
import { getContentCatalogProvider } from "../content-gaps/store";
import { mergeKnowledgeGraph } from "./store";
import type { KnowledgeEdge, KnowledgeGraph, KnowledgeNode } from "./types";

export const knowledgeGraphAnalyzer: IntelligenceAnalyzer<KnowledgeGraph> = {
  id: "knowledge-graph.builder",
  category: "knowledge-graph",
  label: "Knowledge Graph Builder",

  analyze(context): AnalyzerResult<KnowledgeGraph> {
    const moduleId = context.scope.moduleId;
    const provider = moduleId ? getContentCatalogProvider(moduleId) : undefined;

    if (!provider) {
      return {
        analyzerId: "knowledge-graph.builder",
        category: "knowledge-graph",
        generatedAt: context.now,
        confidence: 0.2,
        data: mergeKnowledgeGraph({ nodes: [], edges: [] }),
        metadata: { message: "No catalog provider — empty graph." },
      };
    }

    const snapshot = provider.getSnapshot();
    const nodes: KnowledgeNode[] = [];
    const edges: KnowledgeEdge[] = [];

    for (const categoryId of snapshot.categoryIds) {
      nodes.push({
        id: `cat:${categoryId}`,
        label: categoryId,
        type: "category",
        moduleId,
      });
    }

    for (const slug of snapshot.slugs) {
      nodes.push({
        id: `content:${slug}`,
        label: slug,
        type: "content",
        moduleId,
        metadata: { slug },
      });
    }

    for (let index = 0; index < snapshot.topics.length; index++) {
      const topic = snapshot.topics[index];
      const nodeId = `topic:${topic.toLowerCase().replace(/\s+/g, "-")}`;
      nodes.push({ id: nodeId, label: topic, type: "topic", moduleId });

      const slug = snapshot.slugs[index];
      if (slug) {
        edges.push({
          id: `edge:${nodeId}:content:${slug}`,
          sourceId: nodeId,
          targetId: `content:${slug}`,
          relation: "related-to",
          weight: 1,
          moduleId,
        });
      }
    }

    const graph = mergeKnowledgeGraph({ nodes, edges, generatedAt: context.now });

    return {
      analyzerId: "knowledge-graph.builder",
      category: "knowledge-graph",
      generatedAt: context.now,
      confidence: nodes.length > 0 ? 0.8 : 0.3,
      data: graph,
      metadata: { source: "content-catalog" },
    };
  },
};
