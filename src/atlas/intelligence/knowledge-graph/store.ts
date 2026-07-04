import type { KnowledgeEdge, KnowledgeGraph, KnowledgeNode } from "./types";

let graph: KnowledgeGraph = {
  generatedAt: new Date().toISOString(),
  nodes: [],
  edges: [],
  stats: { nodeCount: 0, edgeCount: 0, avgDegree: 0 },
};

function computeStats(nodes: KnowledgeNode[], edges: KnowledgeEdge[]) {
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const avgDegree = nodeCount === 0 ? 0 : Math.round(((edgeCount * 2) / nodeCount) * 100) / 100;
  return { nodeCount, edgeCount, avgDegree };
}

export function getKnowledgeGraph(): KnowledgeGraph {
  return graph;
}

export function setKnowledgeGraph(next: Omit<KnowledgeGraph, "stats"> & { stats?: KnowledgeGraph["stats"] }): KnowledgeGraph {
  graph = {
    ...next,
    stats: next.stats ?? computeStats(next.nodes, next.edges),
  };
  return graph;
}

export function mergeKnowledgeGraph(input: { nodes: KnowledgeNode[]; edges: KnowledgeEdge[]; generatedAt?: string }): KnowledgeGraph {
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  for (const node of input.nodes) {
    nodeMap.set(node.id, node);
  }

  const edgeMap = new Map(graph.edges.map((edge) => [edge.id, edge]));
  for (const edge of input.edges) {
    edgeMap.set(edge.id, edge);
  }

  const nodes = [...nodeMap.values()];
  const edges = [...edgeMap.values()];

  return setKnowledgeGraph({
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    nodes,
    edges,
    stats: computeStats(nodes, edges),
  });
}

export function findNeighbors(nodeId: string): KnowledgeNode[] {
  const neighborIds = new Set<string>();
  for (const edge of graph.edges) {
    if (edge.sourceId === nodeId) neighborIds.add(edge.targetId);
    if (edge.targetId === nodeId) neighborIds.add(edge.sourceId);
  }
  return graph.nodes.filter((node) => neighborIds.has(node.id));
}
