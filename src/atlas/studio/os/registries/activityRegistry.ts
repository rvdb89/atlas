import type { StudioOsActivityItem } from "../types";
import { createRegistry } from "./createRegistry";

type ActivityProvider = {
  id: string;
  label: string;
  list: () => StudioOsActivityItem[];
};

export const activityProviderRegistry = createRegistry<ActivityProvider>();

export function listRecentActivity(limit = 12): StudioOsActivityItem[] {
  return activityProviderRegistry
    .list()
    .flatMap((provider) => provider.list())
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .slice(0, limit);
}
