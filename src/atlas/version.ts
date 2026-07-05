/** Project Atlas platform version — bump per sprint release. */
export const ATLAS_VERSION = "0.9.0";

export const ATLAS_BUILD = "sprint-10";

export function getAtlasVersionLabel(): string {
  return `Atlas ${ATLAS_VERSION} (${ATLAS_BUILD})`;
}
