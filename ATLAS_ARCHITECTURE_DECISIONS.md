# Atlas Architecture Decisions

Architecture Decision Records (ADRs) for Atlas. Each record is ratified once, by explicit CEO approval, and changes only through a new record — never by silent edit. This document does not restate product vision or roadmap sequencing (see `ATLAS_BUILD_ROADMAP.md`, `ATLAS_VISUAL_BUILD_ROADMAP.md`) or visual/object language (see `ATLAS_VISUAL_CONSTITUTION.md`, `ATLAS_RENDERING_LAW.md`). It records structural decisions about how Atlas's CEO-facing software is put together.

---

## ADR-001 — The Room as the Canonical CEO Surface

**Status:** Ratified, 2026-07-19 (Sprint 4.1 — "Architectuurbeslissing & fundament").

### Context

Atlas currently has two independently-built CEO-facing surfaces: Atlas Control (`/studio/control`, dashboard-style, built first) and The Room (`/atlas`, spatial, built to the ratified Version 1 object language in `ATLAS_VISUAL_CONSTITUTION.md`, `ATLAS_SPRINT_LOG.md` Sprint 14). The Atlas Experience Track governance amendment (`ATLAS_BUILD_ROADMAP.md`, "Governance-amendement — Atlas Experience Track") made the first complete Atlas experience — the Jarvis-like, living, spatial experience The Room already embodies — the primary build objective. That decision implies a structural consequence that had not yet been made explicit or technically enforceable: which of the two surfaces Atlas is building toward, and what happens to the other one. This ADR makes that consequence explicit.

Investigation (Sprint 4.1) confirmed both surfaces already share one real data source — `useControlDashboard()` — consumed identically and unmodified by both `ControlScreenV2.tsx` and `RoomScreen.tsx`. This is the technical basis for treating unification as a presentation and coverage problem, not a data-layer problem.

### Decision

**The Room becomes the single canonical CEO-facing Atlas surface. Atlas Control becomes a transitional implementation used only during migration.**

### Principles

- **Domain logic must remain presentation-independent.** `useControlDashboard()`, `controlDataService.ts`, `controlViewMapper.ts`, and `ceoInboxView.ts`'s `groupCeoInboxItems()` already prove this is possible — this is the pattern to continue, not a new one to build.
- **The same data layer must power both surfaces.** No new or parallel data path may be built for The Room; every capability that migrates draws from the same `ControlSnapshot` Atlas Control already uses.
- **No new CEO-facing capability may be introduced exclusively inside Atlas Control.** From this point forward, any new capability is either built directly for The Room, or deferred.
- **Future functionality must target The Room first.** Where a capability doesn't yet have a Room expression, the answer is to design one (through an Atlas Lab design study where the ratified object language doesn't yet cover it) — not to extend Atlas Control instead.
- **Atlas Control may continue to exist temporarily until migration completes.** It remains reachable and usable during migration; nothing in this ADR removes or hides it.
- **The migration will happen incrementally during Sprint 4.2 and later Experience sprints.** There is no single cutover. Capability moves to The Room one destination at a time, verified as it goes, continuing through the Experience Track (Sprint 4.2 → 5.1 → 5.2 → 5.3) rather than as one large migration event.

This does not introduce a new mental model for Atlas. It applies the Rendering Law and Visual Constitution's existing principle — one object, one judgment channel, no dashboard, no widget — to a question those documents did not yet answer: what happens when two surfaces exist.

### Consequences

- Atlas Control's shell-bypass in `StudioOsShell.tsx` (it opts out of the shared Studio OS chrome specifically on `/studio/control`) and its three-way navigation duplication (`CockpitSidebar.tsx` vs. `routes.ts`'s `ATLAS_STUDIO_NAV` vs. two independent hardcoded route pushes to The Room) are now known, named technical debt with a ratified direction to resolve — not merely an oddity to route around.
- Any future request to add a new CEO-facing capability to Atlas Control should be read against this ADR's principles and redirected to a Room-first design conversation, unless explicitly re-opened as an exception through the roadmap's own governance process.
- The shared data layer is confirmed reusable as-is and is not itself part of the migration work — Sprint 4.2 and later is presentation and destination-design work, not backend work.

### Non-Goals

Sprint 4.1 explicitly does not:

- Redesign The Room.
- Build any new Room object.
- Migrate any Atlas Control functionality (that is Sprint 4.2 and later).
- Redesign navigation, remove routes, or hide Atlas Control.
- Begin Foundation Sprint 1.3.
- Perform a broad refactor of either surface.

Its only scope is making the direction above real, explicit, and technically enforceable.

### Migration Strategy

Migration is incremental, not a single cutover, and follows the capability inventory below:

1. **Partial capabilities first.** Where a Room destination already exists but is not yet data-complete or not yet interactive (CEO Inbox actions on Threshold Stone, real business data on Company Doorways, a real health signal on the Heart), Sprint 4.2 completes those before anything else — the destination is known, only the wiring is missing.
2. **Not-started capabilities require a design step before a build step.** Where no ratified object expresses a capability yet (Live Plan, Roadmap, Bugs, Memory, Management Team, Activity, the Cockpit Opening/escalation concept), the next step is an Atlas Lab design study — the same process that produced Archway Recess and Threshold Stone — not a direct migration. This ADR does not pre-judge those outcomes.
3. **Atlas Control is retired capability-by-capability, not all at once.** A given Atlas Control section is only removed once its Room equivalent has reached parity; until then it stays reachable, per the Non-Goals above.
4. **This continues through the Experience Track**, not just Sprint 4.2 — later Experience sprints (5.1–5.3) may surface further capability that needs a Room destination as the full CEO briefing experience is built out.

---

## Current Architecture (Sprint 4.1 investigation findings)

**Routes.** Atlas Control: `src/app/studio/control.tsx` → `/studio/control`, wrapped by `src/app/studio/_layout.tsx` (`StudioOsProvider` → `StudioOsShell`). The Room: `src/app/atlas.tsx` → `/atlas` and `src/app/room.tsx` → `/room` — both re-export the identical `RoomScreen`, unwrapped by any layout.

**Root components.** Atlas Control's root is `ControlScreenV2.tsx`. `StudioOsShell.tsx` special-cases `pathname === "/studio/control"` and bypasses its own shared chrome (`StudioSidebar`, `StudioInspectorRail`, `AtlasStatusBar`, `CommandPalette`, `QuickActionFab`) for it. The Room's root is `RoomScreen.tsx`, with no wrapping shell at all.

**Shared data layer.** Both roots call `useControlDashboard()` (`src/atlas/studio/control/useControlDashboard.ts`), which wraps `loadControlSnapshot()` → `mapCompanyStateToControlView()` → a single `ControlSnapshot`. Every Atlas Control section component and every Room object already consumes this snapshot (or a slice of it) as a prop — no section does independent fetching, with one exception: `appLauncher.ts` (the "open Doughbert app" liveness check), which is Atlas-Control-specific by nature and out of migration scope (it launches the underlying product app, not a CEO-facing judgment surface).

**Duplicated navigation.** Three independent, non-unified navigation structures exist: `CockpitSidebar.tsx` (rendered on `/studio/control`), `routes.ts`'s `ATLAS_STUDIO_NAV`/`ATLAS_STUDIO_SECONDARY_NAV` (rendered on every other `/studio/*` route), and two separate hardcoded route pushes to The Room from two different files. `routes.ts` also lists both `/atlas` and `/room` as separate secondary-nav entries for what is code-identically one screen.

---

## Capability Inventory

For every capability currently available inside Atlas Control:

| Capability | Current Component | Data Source | Proposed Room Destination | Migration Status |
|---|---|---|---|---|
| CEO Inbox — Approve / Adjust / Defer | `CeoInboxV2.tsx` | `ceoInbox` (`useControlDashboard`) | Threshold Stone → `CeoFocusOverlay.tsx` | **PARTIAL** — destination renders real, capped inbox content; `approveInbox`/`adjustInbox`/`deferInbox` are already returned by the shared hook but not yet wired into the overlay |
| Company Portfolio | `CompanyPortfolioV2.tsx` | `businesses`, `products` | Archway Recess → `CompanyInterior.tsx` | **PARTIAL** — destination exists but is driven by a hardcoded `COMPANY_IDENTITY` visual table, not real business data |
| Company health indicator | `AiHeart.tsx` | `companyHealth` | Heart (`objects/Heart.tsx`) | **PARTIAL** — object exists but carries no health signal today, pure boolean `approached` state only |
| Live execution plan | `LivePlanSectionV2.tsx` | `livePlan` | None yet | **NOT STARTED** |
| Management Team | `ManagementTeamV2.tsx` | `management` | None yet | **NOT STARTED** |
| Roadmap | `RoadmapV2.tsx` | `roadmap`, `sprints` | None yet | **NOT STARTED** |
| Bugs & Blockers | `BugsSectionV2.tsx` | `issues` | None yet | **NOT STARTED** |
| Memory Engine summary | `MemorySectionV2.tsx` | `memory` | None yet | **NOT STARTED** |
| Activity timeline | `ActivityFeedV2.tsx` | `activity` | None yet | **NOT STARTED** |
| Cockpit Opening / "Needs You" escalation | `CockpitOpening.tsx` | `ceoCommand`, `atlasAdvice` | Unresolved — conceptually overlaps Threshold Stone but no ratified object currently expresses "escalation" | **NOT STARTED** — requires an Atlas Lab design study before a destination can even be proposed |

No capability is currently **READY** — Sprint 4.1 did not migrate functionality, only established the shared foundation and destination map.

**Explicitly excluded from this table** (Atlas Control capabilities that are not part of the CEO-facing judgment surface, and are out of migration scope): Settings (routes to `/studio/settings`, a conventional config screen, not a Rendering Law judgment surface) and the "Open Doughbert app" launcher (`appLauncher.ts`, an independent app-liveness check, not company-state judgment). Also excluded: dead/unused components found during investigation (`HeroSection.tsx`, `ExecutiveHeader.tsx`, `KpiStrip.tsx`, `CompanyOverviewV2.tsx`, and `useControlDashboard()`'s unused `primaryCommandAction`/`secondaryCommandAction` exports) — these are deletion candidates once Sprint 4.2 confirms nothing revives them, not migration targets.

---

## What Sprint 4.1 Deliberately Leaves Unresolved for Sprint 4.2

- Wiring `CeoFocusOverlay.tsx` to the already-available `approveInbox`/`adjustInbox`/`deferInbox` actions.
- Data-wiring `CompanyInterior.tsx` to real `businesses`/`products` state instead of the hardcoded `COMPANY_IDENTITY` table.
- Giving the Heart a real health signal from `companyHealth`.
- Finding or designing Room destinations for: Live Plan, Management Team, Roadmap, Bugs & Blockers, Memory Engine, Activity timeline, and the Cockpit Opening/escalation concept — some of these may require a new Atlas Lab design study before they can be built.
- Deciding the final fate of `/room` as a duplicate URL for `/atlas`, and of the two independent hardcoded route pushes to it.
- Retiring the dead Atlas Control components and unused hook exports listed above.

None of this is implemented in Sprint 4.1.
