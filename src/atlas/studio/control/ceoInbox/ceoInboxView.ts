import type { CeoInboxItem, InboxUrgency } from "../types";

export type CeoInboxGroup = "pending" | "attention" | "deferred" | "resolved";

export type GroupedCeoInbox = {
  pending: CeoInboxItem[];
  /** Approved, but the Apply Engine never actually landed the files on disk — see
   * ApprovalModel.applyWarning. Kept visible here instead of falling into "resolved" (which
   * nothing currently renders), because "approved" should never silently mean "done" when it
   * isn't. */
  attention: CeoInboxItem[];
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

function inboxGroup(item: CeoInboxItem): CeoInboxGroup {
  if (item.applyWarning) return "attention";
  if (item.status === "pending" || item.status === "needs_changes") return "pending";
  if (item.status === "deferred") return "deferred";
  return "resolved";
}

function sortPending(items: CeoInboxItem[]): CeoInboxItem[] {
  return [...items].sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]);
}

/** Groups and sorts inbox items from Company State — no hardcoded decisions. */
export function groupCeoInboxItems(items: CeoInboxItem[]): GroupedCeoInbox {
  const pending: CeoInboxItem[] = [];
  const attention: CeoInboxItem[] = [];
  const deferred: CeoInboxItem[] = [];
  const resolved: CeoInboxItem[] = [];

  for (const item of items) {
    const group = inboxGroup(item);
    if (group === "pending") pending.push(item);
    else if (group === "attention") attention.push(item);
    else if (group === "deferred") deferred.push(item);
    else resolved.push(item);
  }

  return {
    pending: sortPending(pending),
    attention,
    deferred: sortPending(deferred),
    resolved,
    total: items.length,
  };
}
