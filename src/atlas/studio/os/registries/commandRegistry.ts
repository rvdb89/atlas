import type { StudioOsCommand } from "../types";
import { createRegistry } from "./createRegistry";

export const commandRegistry = createRegistry<StudioOsCommand>();

export function listCommands(): StudioOsCommand[] {
  return commandRegistry.list().sort((left, right) => left.label.localeCompare(right.label));
}

export function searchCommands(query: string): StudioOsCommand[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return listCommands();

  return listCommands().filter((command) => {
    const haystack = [command.label, command.group, ...(command.keywords ?? [])].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
}
