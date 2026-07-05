import chalk from "chalk";

import {
  ATLAS_PORT,
  checkDependenciesInstalled,
  COMMAND_CENTER_PATH,
  openBrowser,
  waitForUrl,
} from "../shared";
import { autoRecover } from "./recovery";
import { readSession, recordBootTiming, resolveLaunchRoute, resolveWorkspaceName, writeSession, ensureZeroConfigEnv } from "./session";
import { runLiveStartup } from "./startup";
import {
  bootComplete,
  performancePanel,
  renderAtlasBootScreen,
  renderPreviousSession,
} from "./ui";
import { startAtlasRuntime, type ExpoProcessController } from "./expo-process";
import { startAtlasDevServer, stopAtlasDevServer, watchRestartSignal } from "./dev-server";
import { startAtlasWatch, stopAtlasWatch } from "./watch";
import { startSmartHealth } from "./smart-health";
import { collectPerformanceStats } from "./metrics";

export type AtlasOsLaunchOptions = {
  webOnly?: boolean;
  skipBrowser?: boolean;
  skipRecovery?: boolean;
};

export async function launchAtlasOs(options: AtlasOsLaunchOptions = {}): Promise<void> {
  const bootStarted = Date.now();
  const previousSession = readSession();

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
    const recovered = await autoRecover((message) => {
      console.log(chalk.yellow("↻"), message);
    });
    if (!recovered) {
      console.log(chalk.red("Atlas kon poort 8083 niet vrijmaken. Probeer opnieuw over enkele seconden."));
      process.exitCode = 1;
      return;
    }
    console.log("");
  }

  const startup = await runLiveStartup();
  if (startup.blocking) {
    console.log(chalk.red("Atlas kan niet booten — installeer dependencies met npm install"));
    process.exitCode = 1;
    return;
  }

  if (!checkDependenciesInstalled()) {
    process.exitCode = 1;
    return;
  }

  let runtime: ExpoProcessController | null = null;
  let restartInProgress = false;

  const launchRoute = resolveLaunchRoute(previousSession);
  const launchUrl = `http://localhost:${ATLAS_PORT}${launchRoute.path}`;

  const restartRuntime = async () => {
    if (restartInProgress) return;
    restartInProgress = true;
    console.log(chalk.yellow("↻ Restarting Atlas runtime…"));
    runtime?.restart();
    const ready = await waitForUrl(`http://localhost:${ATLAS_PORT}/`, 120_000);
    if (ready && !options.skipBrowser) {
      openBrowser(launchUrl);
    }
    console.log(chalk.green("✔ Atlas runtime restarted"));
    restartInProgress = false;
  };

  startAtlasDevServer({
    onRestart: () => {
      void restartRuntime();
    },
    onRouteChange: (path, label) => {
      console.log(chalk.cyan("◆"), `Route · ${label ?? path}`);
    },
  });

  runtime = startAtlasRuntime({ silent: !options.webOnly });
  watchRestartSignal(() => {
    void restartRuntime();
  });

  console.log(chalk.dim("Starting Atlas runtime…"));
  const ready = await waitForUrl(`http://localhost:${ATLAS_PORT}/`, 120_000);

  if (!ready) {
    console.log(chalk.yellow("⚠ Atlas runtime start duurt langer dan verwacht"));
  }

  if (!options.skipBrowser && ready) {
    openBrowser(launchUrl);
    console.log(chalk.green("✔"), `Opened · ${launchRoute.label}`);
    console.log(chalk.dim(`   ${launchUrl}`));
  }

  const bootSeconds = (Date.now() - bootStarted) / 1000;
  bootComplete(bootSeconds);

  const session = recordBootTiming(bootStarted, previousSession);
  if (!session.lastRoute) {
    session.lastRoute = COMMAND_CENTER_PATH;
    session.lastRouteLabel = launchRoute.label;
  }
  writeSession(session);

  performancePanel(collectPerformanceStats(session));

  if (!options.webOnly) {
    startAtlasWatch();
    startSmartHealth(30_000);
  }

  console.log(chalk.bold("Atlas OS ready"));
  console.log(chalk.dim("Command palette · npm run atlas command"));
  console.log(chalk.dim("Inspector · npm run atlas inspect"));
  console.log(chalk.dim("Overlay · Ctrl+Shift+D in browser"));
  console.log(chalk.dim("Restart · Ctrl+Shift+R in browser"));
  console.log("");
  console.log(chalk.dim("Press Ctrl+C to stop Atlas."));
  console.log("");

  const shutdown = () => {
    stopAtlasWatch();
    stopAtlasDevServer();
    runtime?.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  runtime.child.on("exit", (code: number | null) => {
    stopAtlasWatch();
    stopAtlasDevServer();
    process.exit(code ?? 0);
  });
}
