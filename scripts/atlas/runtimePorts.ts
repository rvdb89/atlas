/**
 * Shared port constants for the Atlas Runtime's local HTTP servers. Lives in its own,
 * dependency-free file specifically so both `atlas-runtime.ts` (which starts these servers)
 * and `atlas/runtimeLifecycle.ts` (which checks on them from separate CLI commands) can import
 * the same values without creating a circular import between the two.
 */
export const APPLY_BRIDGE_PORT = 8791;
export const EXECUTIVE_MEMORY_PORT = 8792;
