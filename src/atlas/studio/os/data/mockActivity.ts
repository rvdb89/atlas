import type { StudioOsActivityItem } from "../types";

const now = Date.now();

export const MOCK_STUDIO_ACTIVITY: StudioOsActivityItem[] = [
  {
    id: "activity-1",
    kind: "workflow-started",
    title: "Workflow gestart",
    message: "Proof of Power pipeline initialized",
    occurredAt: new Date(now - 4 * 60_000).toISOString(),
  },
  {
    id: "activity-2",
    kind: "workflow-completed",
    title: "Workflow voltooid",
    message: "Publishing handoff completed",
    occurredAt: new Date(now - 11 * 60_000).toISOString(),
  },
  {
    id: "activity-3",
    kind: "entity-created",
    title: "Entity aangemaakt",
    message: "Recipe entity seeded in catalog",
    occurredAt: new Date(now - 22 * 60_000).toISOString(),
  },
  {
    id: "activity-4",
    kind: "knowledge-generated",
    title: "Knowledge gegenereerd",
    message: "Knowledge article draft created",
    occurredAt: new Date(now - 35 * 60_000).toISOString(),
  },
  {
    id: "activity-5",
    kind: "draft-published",
    title: "Draft gepubliceerd",
    message: "Review queue item promoted",
    occurredAt: new Date(now - 48 * 60_000).toISOString(),
  },
  {
    id: "activity-6",
    kind: "provider-changed",
    title: "Provider gewijzigd",
    message: "Claude transport switched to mock fallback",
    occurredAt: new Date(now - 62 * 60_000).toISOString(),
  },
];
