import { listEntities } from "../registry/entityStore";
import { createRelationId } from "../utils/id";
import type { EntityGraph, EntityGraphEdge, EntityGraphNode, GraphPath, GraphTraversalOptions } from "./types";

let graph: EntityGraph = {
  generatedAt: new Date().toISOString(),
  nodes: [],
  edges: [],
  stats: { nodeCount: 0, edgeCount: 0, avgDegree: 0, relationKinds: [] },
};

function computeStats(nodes: EntityGraphNode[], edges: EntityGraphEdge[]): EntityGraph["stats"] {
  const relationKinds = [...new Set(edges.map((edge) => edge.kind))];
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const avgDegree = nodeCount === 0 ? 0 : Math.round(((edgeCount * 2) / nodeCount) * 100) / 100;
  return { nodeCount, edgeCount, avgDegree, relationKinds };
}

export function getEntityGraph(): EntityGraph {
  return graph;
}

export function rebuildGraphFromStore(domain?: string): EntityGraph {
  const entities = listEntities(domain ? { domain } : undefined);
  const nodes: EntityGraphNode[] = entities.map((entity) => ({
    id: `node:${entity.id}`,
    entityId: entity.id,
    slug: entity.slug,
    title: entity.title,
    entityType: entity.entityType,
    domain: entity.domain,
    category: entity.category,
  }));

  const nodeByEntityId = new Map(nodes.map((node) => [node.entityId, node]));
  const edges: EntityGraphEdge[] = [];

  for (const entity of entities) {
    for (const relation of entity.relations) {
      const targetNode = nodeByEntityId.get(relation.targetId);
      edges.push({
        id: relation.id ?? createRelationId(entity.id, relation.kind, relation.targetId),
        sourceId: entity.id,
        targetId: relation.targetId,
        kind: relation.kind,
        weight: relation.weight ?? 1,
        metadata: relation.metadata,
        sourceSlug: entity.slug,
        targetSlug: targetNode?.slug ?? relation.targetSlug,
      });

      if (relation.bidirectional && targetNode) {
        edges.push({
          id: createRelationId(relation.targetId, relation.kind, entity.id),
          sourceId: relation.targetId,
          targetId: entity.id,
          kind: relation.kind,
          weight: relation.weight ?? 1,
          sourceSlug: targetNode.slug,
          targetSlug: entity.slug,
        });
      }
    }
  }

  graph = {
    domain,
    generatedAt: new Date().toISOString(),
    nodes,
    edges,
    stats: computeStats(nodes, edges),
  };

  return graph;
}

export function findGraphNode(entityId: string): EntityGraphNode | undefined {
  return graph.nodes.find((node) => node.entityId === entityId);
}

export function findConnectedEdges(entityId: string, options?: GraphTraversalOptions): EntityGraphEdge[] {
  const kinds = options?.relationKinds;
  const direction = options?.direction ?? "outbound";

  return graph.edges.filter((edge) => {
    if (kinds && !kinds.includes(edge.kind)) return false;
    if (direction === "outbound") return edge.sourceId === entityId;
    if (direction === "inbound") return edge.targetId === entityId;
    return edge.sourceId === entityId || edge.targetId === entityId;
  });
}

export function traverseGraph(startEntityId: string, options?: GraphTraversalOptions): GraphPath[] {
  const maxDepth = options?.maxDepth ?? 3;
  const paths: GraphPath[] = [];
  const visited = new Set<string>();

  function walk(currentId: string, depth: number, pathNodes: EntityGraphNode[], pathEdges: EntityGraphEdge[]) {
    if (depth > maxDepth) return;
    visited.add(currentId);

    const edges = findConnectedEdges(currentId, options);
    for (const edge of edges) {
      const nextId = edge.sourceId === currentId ? edge.targetId : edge.sourceId;
      const nextNode = findGraphNode(nextId);
      if (!nextNode || visited.has(nextId)) continue;

      const nextNodes = [...pathNodes, nextNode];
      const nextEdges = [...pathEdges, edge];
      paths.push({ nodes: nextNodes, edges: nextEdges, depth: depth + 1 });
      walk(nextId, depth + 1, nextNodes, nextEdges);
    }
  }

  const startNode = findGraphNode(startEntityId);
  if (startNode) {
    walk(startEntityId, 0, [startNode], []);
  }

  return paths;
}

export function clearEntityGraph(): void {
  graph = {
    generatedAt: new Date().toISOString(),
    nodes: [],
    edges: [],
    stats: { nodeCount: 0, edgeCount: 0, avgDegree: 0, relationKinds: [] },
  };
}
