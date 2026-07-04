export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function ensureUniqueSlug(baseSlug: string, exists: (slug: string) => boolean): string {
  if (!exists(baseSlug)) return baseSlug;

  let index = 2;
  let candidate = `${baseSlug}-${index}`;
  while (exists(candidate)) {
    index += 1;
    candidate = `${baseSlug}-${index}`;
  }
  return candidate;
}
