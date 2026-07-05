import type { MissionControlWidget } from "../types";
import { createRegistry } from "./createRegistry";

export const widgetRegistry = createRegistry<MissionControlWidget>();

export function listMissionControlWidgets(): MissionControlWidget[] {
  return widgetRegistry.list().sort((left, right) => left.order - right.order);
}
