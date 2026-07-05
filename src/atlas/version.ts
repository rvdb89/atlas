/** Project Atlas platform version — bump per sprint release. */
export const ATLAS_VERSION = "0.13.0";

export const ATLAS_BUILD = "brain-sprint-2";

export function getAtlasVersionLabel(): string {
  return `Atlas ${ATLAS_VERSION} (${ATLAS_BUILD})`;
}
