import ora, { type Ora } from "ora";

import { bootstrapAtlas } from "@/atlas/bootstrap";
import { isAtlasAiBootstrapped } from "@/atlas/ai/bootstrap";
import { listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { listProviders } from "@/atlas/ai/providers/registry";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { isAtlasEntityBootstrapped } from "@/atlas/entity/bootstrap";
import { isAtlasIntelligenceBootstrapped } from "@/atlas/intelligence/bootstrap";
import { listRegisteredModules } from "@/atlas/publishing/plugin/registry";
import { isAtlasStudioBootstrapped } from "@/atlas/studio/core/bootstrap";
import { listWorkflows } from "@/atlas/workflows/registry";
import { runAtlasStartupChecks } from "@/atlas/diagnostics";

import {
  checkAnthropicKeyStatus,
  checkDependenciesInstalled,
  checkNodeAndNpm,
  checkRouteFiles,
  commandExists,
  ROOT_DIR,
} from "../shared";
import { statusLine } from "./ui";

type StartupStep = {
  label: string;
  run: () => boolean | Promise<boolean>;
  detail?: () => string;
};

async function runStep(spinner: Ora, step: StartupStep): Promise<boolean> {
  spinner.start(`Checking ${step.label.toLowerCase()}…`);
  try {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const ok = await step.run();
    const detail = step.detail?.();
    spinner.stopAndPersist({
      symbol: ok ? "✔" : "✖",
      text: statusLine(step.label, ok, detail),
    });
    return ok;
  } catch (error) {
    spinner.stopAndPersist({
      symbol: "✖",
      text: statusLine(step.label, false, error instanceof Error ? error.message : "check failed"),
    });
    return false;
  }
}

export async function runLiveStartup(): Promise<{ ok: boolean; blocking: boolean }> {
  console.log(chalkBold("Checking environment…"));
  console.log("");

  const spinner = ora({ color: "yellow" });
  let blocking = false;

  const runtime = checkNodeAndNpm();
  await runStep(spinner, {
    label: "Node",
    run: () => runtime.ok,
    detail: () => runtime.node,
  });
  await runStep(spinner, {
    label: "npm",
    run: () => runtime.ok,
    detail: () => runtime.npm,
  });

  await runStep(spinner, {
    label: "Git",
    run: () => commandExists("git"),
  });

  await runStep(spinner, {
    label: "TypeScript",
    run: () => checkDependenciesInstalled(),
  });

  await runStep(spinner, {
    label: "Packages",
    run: () => checkDependenciesInstalled(),
    detail: () => (checkDependenciesInstalled() ? "node_modules ready" : "run npm install"),
  });

  if (!checkDependenciesInstalled()) {
    blocking = true;
  }

  const routesOk = checkRouteFiles().every((entry) => entry.ok);
  await runStep(spinner, {
    label: "Routes",
    run: () => routesOk,
    detail: () => `${checkRouteFiles().filter((entry) => entry.ok).length} studio routes`,
  });

  bootstrapAtlas();
  runAtlasStartupChecks();

  await runStep(spinner, {
    label: "Atlas Registry",
    run: () => listRegisteredModules().length > 0,
    detail: () => `${listRegisteredModules().length} modules`,
  });

  await runStep(spinner, {
    label: "Entity Engine",
    run: () => isAtlasEntityBootstrapped(),
  });

  await runStep(spinner, {
    label: "Workflow Engine",
    run: () => listWorkflows().length > 0,
    detail: () => `${listWorkflows().length} workflows`,
  });

  await runStep(spinner, {
    label: "Intelligence",
    run: () => isAtlasIntelligenceBootstrapped(),
  });

  const claudeOk = listLiveProviders().some((provider: { id: string }) => provider.id === "claude");
  await runStep(spinner, {
    label: "Claude",
    run: () => claudeOk,
    detail: () =>
      checkAnthropicKeyStatus() === "configured"
        ? "configured · live"
        : isAnthropicConfigured()
          ? "configured"
          : "mock fallback",
  });

  await runStep(spinner, {
    label: "Publishing",
    run: () => isAtlasAiBootstrapped(),
  });

  await runStep(spinner, {
    label: "Studio",
    run: () => isAtlasStudioBootstrapped() && listProviders().length > 0,
    detail: () => `${listProviders().length} providers`,
  });

  console.log("");
  return { ok: !blocking, blocking };
}

function chalkBold(text: string): string {
  // Avoid top-level chalk import cycle with ui.ts
  return `\x1b[1m${text}\x1b[22m`;
}

export function atlasProjectName(): string {
  return ROOT_DIR.split("/").pop() ?? "doughbert-app";
}
