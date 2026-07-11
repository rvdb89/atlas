export type MemoryType =
  | "knowledge"
  | "decision"
  | "preference"
  | "workflow"
  | "conversation"
  | "project"
  | "task"
  | "user";

export type MemoryStatus = "active" | "archived" | "deleted";

export type AtlasMemoryEntry = {
  id: string;
  type: MemoryType;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
  importance: number;
  confidence: number;
  status: MemoryStatus;
};

export type AtlasMemoryEntryInput = {
  type: MemoryType;
  title: string;
  summary: string;
  content: string;
  tags?: string[];
  source: string;
  importance?: number;
  confidence?: number;
  status?: MemoryStatus;
};

export type MemorySearchQuery = {
  text?: string;
  type?: MemoryType;
  tags?: string[];
  minImportance?: number;
  maxImportance?: number;
  createdAfter?: string;
  createdBefore?: string;
  status?: MemoryStatus;
  limit?: number;
};

export type MemorySearchResult = {
  entry: AtlasMemoryEntry;
  score: number;
  matchedOn: string[];
};

export type MemoryProvider = {
  id: string;
  label: string;
  description: string;
  save: (entry: AtlasMemoryEntryInput) => AtlasMemoryEntry;
  get: (id: string) => AtlasMemoryEntry | undefined;
  search: (query: MemorySearchQuery) => MemorySearchResult[];
  update: (id: string, patch: Partial<AtlasMemoryEntryInput>) => AtlasMemoryEntry | undefined;
  archive: (id: string) => AtlasMemoryEntry | undefined;
  delete: (id: string) => boolean;
  list: () => AtlasMemoryEntry[];
};

export type MemoryContext = {
  moduleId: string;
  moduleLabel: string;
  workspace: string;
  userId: string;
  userLabel: string;
  environment: string;
  activeProviderId: string;
};

export type MemorySnapshot = {
  total: number;
  recent: AtlasMemoryEntry[];
  preferences: number;
  projects: number;
  workflows: number;
  health: string;
};

/** BRAIN-002b · Lean, dashboard-safe subset of AtlasMemoryEntry — deliberately drops the
 * full `content` field (can be long-form text) and internal bookkeeping (confidence,
 * status, createdAt) that the CEO dashboard doesn't need for a quick glance. Shared as-is
 * between the Node runtime (scripts/atlas-runtime.ts, which writes it into
 * public/atlas-runtime-state.json) and the RN app's dashboard types, so both sides describe
 * exactly the same shape instead of two independently-hand-typed mirrors going stale. This
 * file has no imports of its own, so importing it from either side never pulls in Node-only
 * (fs/path) or RN-only dependencies. */
export type RecentMemoryEntry = {
  id: string;
  type: MemoryType;
  title: string;
  summary: string;
  tags: string[];
  importance: number;
  source: string;
  updatedAt: string;
};

export type MemoryOperationResult<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};
