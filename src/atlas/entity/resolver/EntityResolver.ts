import type { AtlasEntity, EntityRef } from "../core/types";
import { getEntityById, getEntityBySlug, listEntities } from "../registry/entityStore";
import { findConnectedEdges, getEntityGraph, traverseGraph } from "../graph/builder";
import type { GraphTraversalOptions } from "../graph/types";

export type ResolveRelatedOptions = {
  relationKinds?: string[];
  entityTypes?: string[];
  direction?: GraphTraversalOptions["direction"];
  maxResults?: number;
};

export type ResolveRelatedResult = {
  source: AtlasEntity;
  related: AtlasEntity[];
  relationKinds: string[];
};

function toEntityRef(entity: AtlasEntity): EntityRef {
  return {
    id: entity.id,
    slug: entity.slug,
    title: entity.title,
    entityType: entity.entityType,
    domain: entity.domain,
  };
}

/** Resolves entity relations — domain-agnostic graph traversal. */
export class EntityResolver {
  resolveById(id: string): AtlasEntity | undefined {
    return getEntityById(id);
  }

  resolveBySlug(domain: string, slug: string): AtlasEntity | undefined {
    return getEntityBySlug(domain, slug);
  }

  resolveRelated(sourceId: string, options?: ResolveRelatedOptions): ResolveRelatedResult | undefined {
    const source = getEntityById(sourceId);
    if (!source) return undefined;

    const edges = findConnectedEdges(sourceId, {
      relationKinds: options?.relationKinds,
      direction: options?.direction ?? "outbound",
    });

    const relatedIds = new Set<string>();
    const relationKinds = new Set<string>();

    for (const edge of edges) {
      const targetId = edge.sourceId === sourceId ? edge.targetId : edge.sourceId;
      relatedIds.add(targetId);
      relationKinds.add(edge.kind);
    }

    let related = [...relatedIds]
      .map((id) => getEntityById(id))
      .filter((entity): entity is AtlasEntity => entity !== undefined);

    if (options?.entityTypes?.length) {
      related = related.filter((entity) => options.entityTypes!.includes(entity.entityType));
    }

    if (options?.maxResults) {
      related = related.slice(0, options.maxResults);
    }

    return {
      source,
      related,
      relationKinds: [...relationKinds],
    };
  }

  resolveByRelationKind(sourceId: string, kind: string, entityTypes?: string[]): AtlasEntity[] {
    const result = this.resolveRelated(sourceId, {
      relationKinds: [kind],
      entityTypes,
    });
    return result?.related ?? [];
  }

  resolvePath(sourceId: string, targetId: string, maxDepth = 4): AtlasEntity[] | undefined {
    const paths = traverseGraph(sourceId, { maxDepth, direction: "both" });
    const match = paths.find((path) => path.nodes.some((node) => node.entityId === targetId));
    if (!match) return undefined;

    return match.nodes
      .map((node) => getEntityById(node.entityId))
      .filter((entity): entity is AtlasEntity => entity !== undefined);
  }

  resolveRefs(sourceId: string): EntityRef[] {
    const result = this.resolveRelated(sourceId);
    if (!result) return [];
    return result.related.map(toEntityRef);
  }

  getGraphSnapshot() {
    return getEntityGraph();
  }
}

export const entityResolver = new EntityResolver();
