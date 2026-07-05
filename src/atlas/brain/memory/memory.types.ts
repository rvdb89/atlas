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

export type MemoryOperationResult<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};
