import chalk from "chalk";

import {
  ATLAS_PORT,
  checkDependenciesInstalled,
  openBrowser,
  resolveAtlasStudioLaunchRoute,
  waitForUrl,
} from "../shared";
import { formatRecoveryFailure, recoverAtlasPorts } from "./recovery";
import { readSession, recordBootTiming, resolveLaunchRoute, resolveWorkspaceName, writeSession, ensureZeroConfigEnv } from "./session";
import { runLiveStartup } from "./startup";
import {
  bootComplete,
  performancePanel,
  renderAtlasBootScreen,
  renderPreviousSession,
} from "./ui";
import { startAtlasRuntime, type ExpoProcessController } from "./expo-process";
import { AtlasPortInUseError, startAtlasDevServer, stopAtlasDevServer, watchRestartSignal } from "./dev-server";
import { startAtlasWatch, stopAtlasWatch } from "./watch";
import { startSmartHealth } from "./smart-health";
import { collectPerformanceStats } from "./metrics";

export type AtlasOsLaunchOptions = {
  webOnly?: boolean;
  skipBrowser?: boolean;
  skipRecovery?: boolean;
};

type LauncherResources = {
  runtime: ExpoProcessController | null;
  restartWatcher: NodeJS.Timeout | null;
  healthWatcher: NodeJS.Timeout | null;
};

function createLauncherResources(): LauncherResources {
  return {
    runtime: null,
    restartWatcher: null,
    healthWatcher: null,
  };
}

function stopLauncherResources(resources: LauncherResources): void {
  if (resources.restartWatcher) {
    clearInterval(resources.restartWatcher);
    resources.restartWatcher = null;
  }
  if (resources.healthWatcher) {
    clearInterval(resources.healthWatcher);
    resources.healthWatcher = null;
  }
  stopAtlasWatch();
  stopAtlasDevServer();
  resources.runtime?.stop();
  resources.runtime = null;
}

function reportBrowserLaunch(url: string, label: string): void {
  console.log(chalk.green("✔"), "Atlas Studio ready");
  console.log(chalk.green("✔"), `Opening ${label}`);

  const result = openBrowser(url);
  if (result.ok) {
    console.log(chalk.dim(`   ${url}`));
    return;
  }

  console.log(chalk.yellow("⚠ Browser kon niet automatisch geopend worden."));
  console.log(chalk.dim(`   Open handmatig: ${url}`));
  console.log(chalk.dim(`   Reden: ${result.reason}`));
}

function failLaunch(resources: LauncherResources, message: string, detail?: string): void {
  stopLauncherResources(resources);
  console.log("");
  console.log(chalk.red(message));
  if (detail) {
    console.log("");
    console.log(detail);
  }
  console.log("");
  process.exit(1);
}

export async function launchAtlasOs(options: AtlasOsLaunchOptions = {}): Promise<void> {
  const bootStarted = Date.now();
  const previousSession = readSession();
  const resources = createLauncherResources();

  try {
    renderAtlasBootScreen({
      workspace: resolveWorkspaceName(),
      environment: process.env.NODE_ENV ?? "Development",
    });

    renderPreviousSession({
      branch: previousSession.branch,
      lastCommitShort: previousSession.lastCommitShort,
      lastRouteLabel: previousSession.lastRouteLabel,
    });

    ensureZeroConfigEnv();

    if (!options.skipRecovery) {
      const recovered = await recoverAtlasPorts((message) => {
        console.log(chalk.yellow("↻"), message);
      });
      if (!recovered.ok) {
        failLaunch(resources, "Atlas kon niet starten — poortconflict", formatRecoveryFailure(recovered));
      }
      console.log("");
    }

    const startup = await runLiveStartup();
    if (startup.blocking) {
      failLaunch(resources, "Atlas kan niet booten — installeer dependencies met npm install");
    }

    if (!checkDependenciesInstalled()) {
      failLaunch(resources, "Atlas kan niet booten — dependencies ontbreken");
    }

    let restartInProgress = false;
    const launchRoute = resolveLaunchRoute(previousSession);
    const launchUrl = `http://localhost:${ATLAS_PORT}${launchRoute.path}`;

    const restartRuntime = async () => {
      if (restartInProgress) return;
      restartInProgress = true;

      try {
        console.log(chalk.yellow("↻ Restarting Atlas runtime…"));
        resources.runtime?.restart();
        const ready = await waitForUrl(`http://localhost:${ATLAS_PORT}/`, 120_000);
        if (ready && !options.skipBrowser) {
          reportBrowserLaunch(launchUrl, launchRoute.label);
        } else if (!ready) {
          console.log(chalk.yellow("⚠ Atlas runtime restart timed out after 120s"));
        }
        console.log(chalk.green("✔ Atlas runtime restarted"));
      } catch (error) {
        console.log(chalk.red("✖ Atlas runtime restart failed"));
        console.log(chalk.dim(error instanceof Error ? error.message : String(error)));
      } finally {
        restartInProgress = false;
      }
    };

    try {
      await startAtlasDevServer({
        onRestart: () => {
          void restartRuntime();
        },
        onRouteChange: (path, label) => {
          console.log(chalk.cyan("◆"), `Route · ${label ?? path}`);
        },
      });
    } catch (error) {
      if (error instanceof AtlasPortInUseError) {
        failLaunch(resources, "Atlas kon de dev API niet starten.", error.detail);
      }
      throw error;
    }

    resources.runtime = startAtlasRuntime({ silent: !options.webOnly });
    resources.restartWatcher = watchRestartSignal(() => {
      void restartRuntime();
    });

    console.log(chalk.dim("Starting Atlas runtime…"));
    const ready = await waitForUrl(`http://localhost:${ATLAS_PORT}/`, 120_000);

    if (!ready) {
      console.log(chalk.yellow("⚠ Atlas runtime start duurt langer dan verwacht"));
    }

    if (!options.skipBrowser && ready) {
      reportBrowserLaunch(launchUrl, launchRoute.label);
    } else {
      console.log(chalk.green("✔"), "Atlas Studio ready");
    }

    const bootSeconds = (Date.now() - bootStarted) / 1000;
    bootComplete(bootSeconds);

    const session = recordBootTiming(bootStarted, previousSession);
    const studioRoute = resolveAtlasStudioLaunchRoute(session);
    if (!session.lastRoute?.startsWith("/studio")) {
      session.lastRoute = studioRoute.path;
      session.lastRouteLabel = studioRoute.label;
    }
    writeSession(session);

    performancePanel(collectPerformanceStats(session));

    if (!options.webOnly) {
      startAtlasWatch();
      resources.healthWatcher = startSmartHealth(30_000);
    }

    console.log(chalk.dim(`Studio route · ${studioRoute.path}`));
    console.log(chalk.dim("Command palette · npm run atlas command"));
    console.log(chalk.dim("Inspector · npm run atlas inspect"));
    console.log(chalk.dim("Overlay · Ctrl+Shift+D in browser"));
    console.log(chalk.dim("Restart · Ctrl+Shift+R in browser"));
    console.log("");
    console.log(chalk.dim("Press Ctrl+C to stop Atlas."));
    console.log("");

    const shutdown = (code = 0) => {
      stopLauncherResources(resources);
      process.exit(code);
    };

    process.on("SIGINT", () => shutdown(0));
    process.on("SIGTERM", () => shutdown(0));

    resources.runtime.child.on("exit", (code: number | null) => {
      shutdown(code ?? 0);
    });
  } catch (error) {
    failLaunch(
      resources,
      "Atlas kon niet starten.",
      error instanceof Error ? error.message : String(error),
    );
  }
}
