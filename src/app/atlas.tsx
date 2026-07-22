// Sprint 2.2 ("The Room — First Living Prototype"): the real entry point — where Atlas
// becomes visible for the first time. Same screen as `/room` (no fork, no duplicate
// implementation); `/room` is left in place unchanged since other navigation already links
// to it (`ATLAS_STUDIO_SECONDARY_NAV`).
//
// Phase 5.9 ("Complete Presentation Reset") repoints this at `AtlasSpace.tsx`, the file that
// replaced `RoomScreen.tsx` (deleted this sprint). The route itself — its URL, its place in
// the Stack — is untouched; only which component renders at it changed.
export { default } from "@/atlas/studio/room/AtlasSpace";
