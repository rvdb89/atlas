/** Memory interfaces — implementation deferred to future sprints. */

export type MemoryScope = "conversation" | "task" | "domain" | "project";

export type MemoryRecord = {
  id: string;
  scope: MemoryScope;
  key: string;
  value: unknown;
  moduleId?: string;
  projectId?: string;
  taskId?: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
};

export type ConversationMemoryStore = {
  append(conversationId: string, message: unknown): Promise<MemoryRecord>;
  getHistory(conversationId: string, limit?: number): Promise<MemoryRecord[]>;
  clear(conversationId: string): Promise<void>;
};

export type TaskMemoryStore = {
  rememberTask(taskId: string, key: string, value: unknown): Promise<MemoryRecord>;
  recallTask(taskId: string, key: string): Promise<unknown>;
};

export type DomainMemoryStore = {
  rememberDomain(moduleId: string, key: string, value: unknown): Promise<MemoryRecord>;
  recallDomain(moduleId: string, key: string): Promise<unknown>;
};

export type ProjectMemoryStore = {
  rememberProject(projectId: string, key: string, value: unknown): Promise<MemoryRecord>;
  recallProject(projectId: string, key: string): Promise<unknown>;
};

export type AtlasMemorySystem = {
  conversation: ConversationMemoryStore;
  task: TaskMemoryStore;
  domain: DomainMemoryStore;
  project: ProjectMemoryStore;
};
