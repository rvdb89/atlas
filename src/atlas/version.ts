/** Project Atlas platform version — bump per sprint release. */
export const ATLAS_VERSION = "0.10.0";

export const ATLAS_BUILD = "sprint-11.5";

export function getAtlasVersionLabel(): string {
  return `Atlas ${ATLAS_VERSION} (${ATLAS_BUILD})`;
}
