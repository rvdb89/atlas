import { buildContextBundle } from "./ContextBuilder";
import { resolveContext } from "./ContextResolver";
import {
  createContextSnapshotFromBundle,
  filterContextBundle,
  getContextSnapshot,
  mergeContextBundles,
  setContextSnapshot,
} from "./ContextSnapshot";
import type {
  ContextBuildInput,
  ContextBundle,
  ContextFilter,
  ContextOperationResult,
  ContextScoreInput,
  ContextSnapshot,
} from "./context.types";
import { scoreContextItem } from "./ContextResolver";

function success<T>(data: T): ContextOperationResult<T> {
  return { ok: true, data };
}

function failure<T>(message: string): ContextOperationResult<T> {
  return { ok: false, message };
}

export class ContextEngine {
  buildContext(input: ContextBuildInput): ContextOperationResult<ContextBundle> {
    try {
      const bundle = buildContextBundle(input);
      return success(bundle);
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to build context");
    }
  }

  resolveContext(bundle: ContextBundle, topic?: string): ContextOperationResult<ContextBundle> {
    try {
      return success(resolveContext(bundle, topic));
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to resolve context");
    }
  }

  mergeContext(left: ContextBundle, right: Partial<ContextBundle>): ContextOperationResult<ContextBundle> {
    try {
      return success(mergeContextBundles(left, right));
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to merge context");
    }
  }

  filterContext(bundle: ContextBundle, filter?: ContextFilter): ContextOperationResult<ContextBundle> {
    try {
      return success(filterContextBundle(bundle, filter));
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to filter context");
    }
  }

  scoreContext(input: ContextScoreInput): number {
    return scoreContextItem(input);
  }

  createSnapshot(input: ContextBuildInput, filter?: ContextFilter): ContextOperationResult<ContextSnapshot> {
    const built = this.buildContext(input);
    if (!built.ok || !built.data) {
      return failure(built.message ?? "Failed to build context");
    }

    const resolved = this.resolveContext(built.data, input.topic);
    if (!resolved.ok || !resolved.data) {
      return failure(resolved.message ?? "Failed to resolve context");
    }

    const filtered = this.filterContext(resolved.data, filter);
    if (!filtered.ok || !filtered.data) {
      return failure(filtered.message ?? "Failed to filter context");
    }

    const snapshot = createContextSnapshotFromBundle(filtered.data);
    setContextSnapshot(snapshot);
    return success(snapshot);
  }

  getSnapshot(): ContextSnapshot | null {
    return getContextSnapshot();
  }
}

export const contextEngine = new ContextEngine();

export function refreshContextSnapshot(input: ContextBuildInput, filter?: ContextFilter): ContextOperationResult<ContextSnapshot> {
  return contextEngine.createSnapshot(input, filter);
}
