/** Project Atlas platform version — bump per sprint release. */
export const ATLAS_VERSION = "0.21.0";

export const ATLAS_BUILD = "atlas-002";

export function getAtlasVersionLabel(): string {
  return `Atlas ${ATLAS_VERSION} (${ATLAS_BUILD})`;
}
