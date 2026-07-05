export type AtlasDevNotificationKind =
  | "workflow"
  | "claude"
  | "route"
  | "registry"
  | "health"
  | "system";

export type AtlasDevNotification = {
  id: string;
  kind: AtlasDevNotificationKind;
  title: string;
  message: string;
  createdAt: number;
};

type Listener = (notification: AtlasDevNotification) => void;

const listeners = new Set<Listener>();
const recent: AtlasDevNotification[] = [];

export function subscribeAtlasDevNotifications(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function pushAtlasDevNotification(
  input: Omit<AtlasDevNotification, "id" | "createdAt"> & { id?: string },
): AtlasDevNotification {
  const notification: AtlasDevNotification = {
    id: input.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: input.kind,
    title: input.title,
    message: input.message,
    createdAt: Date.now(),
  };

  recent.unshift(notification);
  if (recent.length > 12) recent.pop();

  for (const listener of listeners) {
    listener(notification);
  }

  return notification;
}

export function listRecentAtlasDevNotifications(): AtlasDevNotification[] {
  return [...recent];
}

export const ATLAS_DEV_API = "http://127.0.0.1:8084";

export const ATLAS_ROUTE_LABELS: Record<string, string> = {
  "/studio/command-center": "Studio / Command Center",
  "/studio/health": "Studio / Health Dashboard",
  "/studio/proof-of-power": "Studio / Proof Of Power",
  "/studio": "Studio / Home",
};
