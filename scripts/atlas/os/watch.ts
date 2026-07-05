import chokidar, { type FSWatcher } from "chokidar";

import { ROOT_DIR } from "../shared";
import { WATCH_PATHS } from "./constants";
import { watchEvent } from "./ui";

type WatchHandlers = {
  onEntity?: () => void;
  onWorkflow?: () => void;
  onStudio?: () => void;
  onProvider?: () => void;
};

let watcher: FSWatcher | null = null;

export function startAtlasWatch(handlers: WatchHandlers = {}): FSWatcher {
  if (watcher) return watcher;

  console.log("Watching Atlas…");
  console.log("");

  const paths = WATCH_PATHS.map((entry) => `${ROOT_DIR}/${entry}`);

  watcher = chokidar.watch(paths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 250, pollInterval: 100 },
  });

  watcher.on("all", (event, filePath) => {
    const relative = filePath.replace(`${ROOT_DIR}/`, "");

    if (relative.includes("/entity/")) {
      watchEvent("Entity gewijzigd");
      handlers.onEntity?.();
      return;
    }

    if (relative.includes("/workflows/")) {
      watchEvent("Workflow registry bijgewerkt");
      handlers.onWorkflow?.();
      return;
    }

    if (relative.includes("/studio/") || relative.includes("/app/studio/")) {
      watchEvent("Studio refreshed");
      handlers.onStudio?.();
      return;
    }

    if (relative.includes("/ai/providers/")) {
      watchEvent("Claude provider reloaded");
      handlers.onProvider?.();
      return;
    }

    if (event === "add" || event === "change") {
      watchEvent(`Atlas update · ${relative}`);
    }
  });

  return watcher;
}

export function stopAtlasWatch(): void {
  watcher?.close();
  watcher = null;
}
