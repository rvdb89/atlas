/** Canonical Atlas Entity — domain-agnostic knowledge primitive. */

export type EntityStatus = "draft" | "review" | "published" | "archived" | "deprecated";

export type EntityVisibility = "public" | "private" | "unlisted" | "internal";

export type EntityDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type EntityMediaItem = {
  id: string;
  kind: "image" | "video" | "audio" | "document" | "embed";
  url?: string;
  alt?: string;
  caption?: string;
  role?: string;
  metadata?: Record<string, unknown>;
};

export type EntitySeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalSlug?: string;
};

export type EntityAttributeValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | Record<string, unknown>
  | null;

export type EntityAttributes = Record<string, EntityAttributeValue>;

export type EntityRelation = {
  id: string;
  kind: string;
  targetId: string;
  targetSlug?: string;
  label?: string;
  weight?: number;
  bidirectional?: boolean;
  metadata?: Record<string, unknown>;
};

export type EntityMetadata = Record<string, unknown>;

/** Full entity record — every vertical maps its content onto this shape. */
export type AtlasEntity = {
  id: string;
  slug: string;
  title: string;
  description: string;
  entityType: string;
  domain: string;
  category: string;
  subCategory?: string;
  attributes: EntityAttributes;
  relations: EntityRelation[];
  tags: string[];
  difficulty?: EntityDifficulty;
  metadata: EntityMetadata;
  media: EntityMediaItem[];
  seo: EntitySeo;
  visibility: EntityVisibility;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type EntityRef = Pick<AtlasEntity, "id" | "slug" | "title" | "entityType" | "domain">;

export type EntityDraft = Omit<AtlasEntity, "id" | "createdAt" | "updatedAt" | "version"> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
};

export type EntityPatch = Partial<
  Omit<AtlasEntity, "id" | "createdAt" | "domain" | "entityType" | "version">
> & {
  incrementVersion?: boolean;
};

export type EntityLifecycleEvent = {
  entityId: string;
  fromStatus?: EntityStatus;
  toStatus: EntityStatus;
  occurredAt: string;
  actorId?: string;
  reason?: string;
};

export type EntityStoreFilter = {
  domain?: string;
  entityType?: string;
  category?: string;
  subCategory?: string;
  status?: EntityStatus | EntityStatus[];
  visibility?: EntityVisibility;
  tags?: string[];
  slug?: string;
};

export type EntityValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
  field?: string;
};

export type EntityValidationResult = {
  valid: boolean;
  issues: EntityValidationIssue[];
};

export type EntityQueryResult = {
  items: AtlasEntity[];
  total: number;
  offset: number;
  limit: number;
};

export type EntitySearchResult = {
  entity: AtlasEntity;
  score: number;
  matchedFields: string[];
};

export type EntitySearchResponse = {
  query: string;
  results: EntitySearchResult[];
  total: number;
  tookMs: number;
};
