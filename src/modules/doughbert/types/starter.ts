/** One feeding event for the user's own sourdough starter. */
export type StarterFeeding = {
  id: string;
  /** ISO timestamp of when the starter was fed. */
  fedAt: string;
};

/** A single user's personal starter — named, tracked locally on-device. Not baking
 * content (that lives in the Knowledge library); this is the user's own live starter. */
export type StarterProfile = {
  name: string;
  createdAt: string;
  /** Newest first. */
  feedings: StarterFeeding[];
};
