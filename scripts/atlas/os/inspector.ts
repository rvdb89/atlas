import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import boxen from "boxen";
import chalk from "chalk";

import { bootstrapAtlas } from "@/atlas/bootstrap";
import { listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { listProviders } from "@/atlas/ai/providers/registry";
import { listTaskRegistryEntries } from "@/atlas/ai/registry/taskRegistry";
import { listRegisteredEntityTypes } from "@/atlas/entity/registry/entityTypeRegistry";
import { listRegisteredModules } from "@/atlas/publishing/plugin/registry";
import { listWorkflows } from "@/atlas/workflows/registry";

import { checkRouteFiles, ROOT_DIR } from "../shared";
import { collectPerformanceStats } from "./metrics";
import { readSession } from "./session";

type InspectorSection = {
  title: string;
  lines: string[];
};

function listStudioRoutes(): string[] {
  const studioDir = join(ROOT_DIR, "src/app/studio");
  if (!existsSync(studioDir)) return [];

  return readdirSync(studioDir)
    .filter((file) => file.endsWith(".tsx") && !file.startsWith("_"))
    .map((file) => `/studio/${file.replace(".tsx", "")}`);
}

function scanAtlasImports(): { file: string; imports: string[] }[] {
  const atlasDir = join(ROOT_DIR, "src/atlas");
  const results: { file: string; imports: string[] }[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;

      const source = readFileSync(fullPath, "utf8");
      const imports = [...source.matchAll(/from\s+["'](@\/atlas\/[^"']+)["']/g)].map((match) => match[1]);
      if (imports.length > 0) {
        results.push({ file: fullPath.replace(`${ROOT_DIR}/`, ""), imports });
      }
    }
  };

  walk(atlasDir);
  return results;
}

function detectCircularHints(imports: { file: string; imports: string[] }[]): string[] {
  const graph = new Map<string, string[]>();

  for (const entry of imports) {
    graph.set(entry.file, entry.imports.map((value) => value.replace("@/atlas/", "src/atlas/")));
  }

  const cycles: string[] = [];
  for (const [file, deps] of graph.entries()) {
    for (const dep of deps) {
      const depFilePrefix = dep.split("/").slice(0, 4).join("/");
      const reverse = [...graph.entries()].find(([key]) => key.startsWith(depFilePrefix));
      if (reverse && reverse[1].some((value) => file.includes(value.replace("@/atlas/", "")))) {
        cycles.push(`${file} ↔ ${dep}`);
      }
    }
  }

  return [...new Set(cycles)].slice(0, 5);
}

export function buildInspectorSections(): InspectorSection[] {
  bootstrapAtlas();

  const modules = listRegisteredModules();
  const providers = listProviders();
  const liveProviders = listLiveProviders();
  const workflows = listWorkflows();
  const entityTypes = listRegisteredEntityTypes();
  const tasks = listTaskRegistryEntries();
  const routes = checkRouteFiles();
  const studioRoutes = listStudioRoutes();
  const importGraph = scanAtlasImports();
  const cycles = detectCircularHints(importGraph);

  const liveIds = new Set(liveProviders.map((provider: { id: string }) => provider.id));
  const unusedProviders = providers
    .map((provider: { id: string }) => provider.id)
    .filter((id: string) => !liveIds.has(id));

  const pkg = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const performance = collectPerformanceStats(readSession());

  return [
    {
      title: "Modules",
      lines: modules.map((module) => `• ${module.name} (${module.id})`),
    },
    {
      title: "Providers",
      lines: [
        ...providers.map((provider: { id: string }) => `• ${provider.id}`),
        "",
        `Live providers · ${liveProviders.length}`,
      ],
    },
    {
      title: "Routes",
      lines: [
        ...routes.map((route) => `${route.ok ? "✔" : "✖"} ${route.route.replace("src/app", "")}`),
        "",
        "Studio routes:",
        ...studioRoutes.map((route) => `• ${route}`),
      ],
    },
    {
      title: "Registries",
      lines: [
        `Entity types · ${entityTypes.length}`,
        `Workflows · ${workflows.length}`,
        `AI tasks · ${tasks.length}`,
        `Modules · ${modules.length}`,
      ],
    },
    {
      title: "Dependencies",
      lines: [
        `Runtime · ${Object.keys(pkg.dependencies ?? {}).length}`,
        `Dev · ${Object.keys(pkg.devDependencies ?? {}).length}`,
      ],
    },
    {
      title: "Circular deps",
      lines: cycles.length > 0 ? cycles.map((cycle) => `• ${cycle}`) : ["• none detected"],
    },
    {
      title: "Unused providers",
      lines: unusedProviders.length > 0 ? unusedProviders.map((id) => `• ${id}`) : ["• none"],
    },
    {
      title: "Missing workflows",
      lines: workflows.length > 0 ? [`• ${workflows.length} registered`] : ["• none registered"],
    },
    {
      title: "Performance",
      lines: Object.entries(performance).map(([key, value]) => `• ${key} · ${value}`),
    },
  ];
}

export function printInspectorReport(): void {
  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Inspector"));
  console.log(chalk.dim("───────────────"));
  console.log("");

  for (const section of buildInspectorSections()) {
    console.log(
      boxen(section.lines.join("\n"), {
        title: section.title,
        padding: 1,
        borderColor: "#7A6652",
        borderStyle: "round",
      }),
    );
    console.log("");
  }
}
