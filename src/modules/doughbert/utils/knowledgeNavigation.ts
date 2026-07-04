export const KNOWLEDGE_RETURN_TO_PARAM = "returnTo";

export function buildKnowledgeBiteHref(biteRoute: string, returnTo?: string): string {
  if (!returnTo || !isSafeInternalRoute(returnTo)) {
    return biteRoute;
  }

  const separator = biteRoute.includes("?") ? "&" : "?";
  return `${biteRoute}${separator}${KNOWLEDGE_RETURN_TO_PARAM}=${encodeURIComponent(returnTo)}`;
}

export function resolveKnowledgeBackRoute(returnTo: string | string[] | undefined): string {
  const value = Array.isArray(returnTo) ? returnTo[0] : returnTo;

  if (typeof value === "string" && isSafeInternalRoute(value)) {
    return value;
  }

  return "/knowledge";
}

function isSafeInternalRoute(route: string): boolean {
  return route.startsWith("/") && !route.startsWith("//");
}
