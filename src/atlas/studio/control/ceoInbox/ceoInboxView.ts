import type { CeoInboxItem, InboxDecisionStatus, InboxUrgency } from "../types";

export type CeoInboxGroup = "pending" | "deferred" | "resolved";

export type GroupedCeoInbox = {
  pending: CeoInboxItem[];
  deferred: CeoInboxItem[];
  resolved: CeoInboxItem[];
  total: number;
};

const URGENCY_RANK: Record<InboxUrgency, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function inboxGroup(status: InboxDecisionStatus): CeoInboxGroup {
  if (status === "pending" || status === "needs_changes") return "pending";
  if (status === "deferred") return "deferred";
  return "resolved";
}

function sortPending(items: CeoInboxItem[]): CeoInboxItem[] {
  return [...items].sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]);
}

/** Groups and sorts inbox items from Company State — no hardcoded decisions. */
export function groupCeoInboxItems(items: CeoInboxItem[]): GroupedCeoInbox {
  const pending: CeoInboxItem[] = [];
  const deferred: CeoInboxItem[] = [];
  const resolved: CeoInboxItem[] = [];

  for (const item of items) {
    const group = inboxGroup(item.status);
    if (group === "pending") pending.push(item);
    else if (group === "deferred") deferred.push(item);
    else resolved.push(item);
  }

  return {
    pending: sortPending(pending),
    deferred: sortPending(deferred),
    resolved,
    total: items.length,
  };
}
