import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { bootstrapAtlas } from "@/atlas/bootstrap";
import { listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { listProviders } from "@/atlas/ai/providers/registry";
import { listTaskRegistryEntries } from "@/atlas/ai/registry/taskRegistry";
import { getEntityCount } from "@/atlas/entity/registry/entityStore";
import { listRegisteredModules } from "@/atlas/publishing/plugin/registry";
import { listWorkflows } from "@/atlas/workflows/registry";

import { ROOT_DIR } from "../shared";
import type { AtlasSession } from "./session";

function countRecipeEntries(): number {
  const recipesPath = join(ROOT_DIR, "src/data/recipes.ts");
  if (!existsSync(recipesPath)) return 0;
  const source = readFileSync(recipesPath, "utf8");
  const matches = source.match(/\bid:\s*["'`]/g);
  return matches?.length ?? 0;
}

function countKnowledgeObjects(): number {
  const knowledgeDir = join(ROOT_DIR, "src/data/knowledge");
  if (!existsSync(knowledgeDir)) return 0;

  let count = 0;
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.name.endsWith(".ts")) continue;
      const source = readFileSync(fullPath, "utf8");
      if (/slug:\s*["'`]/.test(source) || /id:\s*["'`]/.test(source)) {
        count += 1;
      }
    }
  };

  walk(knowledgeDir);
  return count;
}

export type AtlasPerformanceStats = {
  coldBoot: string;
  warmBoot: string;
  entities: number;
  workflows: number;
  providers: number;
  aiModules: number;
  recipes: number;
  knowledgeObjects: number;
};

export function collectPerformanceStats(session: AtlasSession): AtlasPerformanceStats {
  bootstrapAtlas();

  return {
    coldBoot: session.coldBootMs ? `${(session.coldBootMs / 1000).toFixed(2)} sec` : "pending",
    warmBoot: session.warmBootMs ? `${(session.warmBootMs / 1000).toFixed(2)} sec` : "pending",
    entities: getEntityCount(),
    workflows: listWorkflows().length,
    providers: listProviders().length,
    aiModules: listTaskRegistryEntries().length + listRegisteredModules().length,
    recipes: countRecipeEntries(),
    knowledgeObjects: countKnowledgeObjects(),
  };
}

export function collectLiveProviderCount(): number {
  bootstrapAtlas();
  return listLiveProviders().length;
}
