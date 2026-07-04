export function nextEntityVersion(current: number, increment = true): number {
  return increment ? current + 1 : current;
}

export function isVersionDowngrade(current: number, next: number): boolean {
  return next < current;
}

export function formatEntityVersion(version: number): string {
  return `v${version}`;
}
