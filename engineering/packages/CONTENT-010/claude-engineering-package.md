# Execution Package — CONTENT-010

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Yes (5/10)

- Mission focus advances autonomy capabilities.
- Mission strengthens Atlas platform execution infrastructure.
- Evaluated against: Work advances the North Star when it reduces manual steps toward autonomous execution
- Evaluated against: Missions must map to at least one Capability and one System
- North Star: Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.

## Organizational Model

- **Atlas role:** Branch Director (Vestigingsdirecteur)
- **Organization model:** ATLAS-002
- **Departments:** Engineering, Quality Assurance, Operations
- **Workers assigned:** 4
- **Execution Package required:** Yes

Atlas (Branch Director) routes software work to Engineering department. Execution Package will be generated for Claude Engineer execution. ChatGPT defines architecture; Atlas operationalizes execution.

## Evolution Engine

- **Engine ID:** ATLAS-001
- **North Star aligned:** Yes (9/10)
- **Selected mission:** CONTENT-010
- **Recommended Next Initiative:** CONTENT-007

Mijn advies is om Content te verbeteren.
Reden: Content is ontwikkelend volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Atlas Constitution (ATLAS-000). Mission ID CONTENT-010 provided — evolution assessment confirms alignment. Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected CONTENT-010 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 84%. Developing: Memory, Context, Planning, Execution, Content. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Content (25% gap), Context (10% gap), Orchestration (10% gap), Execution (8% gap), Memory (7% gap), Planning (5% gap)
- **Highest value:** Content

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 10 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 6 platform gap(s) identified
- **Recommended Evolution** (pass) — CONTENT-010 · CONTENT-010
- **Mission Registry** (pass) — CONTENT-010 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
CONTENT-010
```

No additional instructions from ChatGPT are required or expected.

Humans may express intent (e.g. "better at reasoning"); Atlas maps intent to missions via the Constitution.

## Atlas inference pipeline

```
Constitution
↓
North Star
↓
Principles
↓
Capabilities
↓
Systems
↓
Roadmap
↓
Mission Registry
↓
Execution Packages
↓
Claude
↓
Branch Director Review
```

## Mission (from Registry)

- **Mission ID:** CONTENT-010
- **Title:** Retry: 17 overgeslagen technieken-artikelen
- **Registry source:** engineering/missions/CONTENT-010.mission
- **Template:** engineering
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-10T19:35:28.034Z

## Goal

Bij CONTENT-007 (technieken) landden maar 5 van de 22 artikelen — een veel hoger uitvalpercentage dan elke andere categorie. Onderzoek wees een echte bug uit (zie BRAIN-010): createClaudeTransport.ts ving elke mislukte Claude-aanroep stil op en verving die door een placeholder, zonder dat dit ergens zichtbaar werd. Vermoedelijke oorzaak: een rate limit na 22 snelle aanroepen zonder pauze. Die bug is nu gefixed (zichtbare foutmelding, automatische retry met backoff, pauze tussen artikelen). Deze mission probeert de 17 overgeslagen artikelen opnieuw.

## Implementation focus

- scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-010"])
- src/atlas/ai/providers/transport/createClaudeTransport.ts (de eigenlijke bugfix — retry met backoff vóór terugvallen op een placeholder)
- src/atlas/ai/core/Orchestrator.ts (formatTaskExecutionLog — toont nu duidelijk wanneer een aanroep stil terugviel)
- src/modules/doughbert/knowledge/techniques/index.ts (bevat al de 5 gelukte technieken-artikelen — blijft ongewijzigd)
- src/modules/doughbert/knowledge/technieken-retry/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van techniques/index.ts zodat de 5 al toegepaste artikelen niet worden overschreven)
- src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array)
- src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de stubs van artikelen die deze keer wél lukken)

## Constraints

- Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; blijft een artikel te dun of mislukt de aanroep opnieuw, dan wordt dat gerapporteerd met de echte oorzaak (niet de generieke "geen contentPayload"-melding) en blijft de bestaande stub staan
- De 5 al toegepaste technieken-artikelen worden niet opnieuw gegenereerd en niet overschreven
- TypeScript blijft compileren zonder nieuwe errors

## Engineering Standards (inferred)

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Deterministic, rule-based orchestration before AI generation
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star (inferred)

- Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- Atlas interprets natural-language intent and proposes the recommended next initiative
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Execution packages are generated without external brief writing
- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents

## Architecture Rules (inferred)

- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

## Mission Dependencies (inferred)

- **CONTENT-001** · Recipe Knowledge Content Wiring · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-002** · Kennisartikelen Hydratatie vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-003** · Kennisartikelen Temperaturen vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-004** · Kennisartikelen Fermentatie vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-005** · Kennisartikelen Starter vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-006** · Kennisartikelen Bakwetenschap vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-007** · Kennisartikelen Technieken vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-008** · Overgeslagen artikel Kamertemperatuur alsnog schrijven · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-009** · Overgeslagen artikel Zure starter alsnog schrijven · _requires_ — Prior CONTENT mission in sequence

## Definition of Done

- [ ] Retry: 17 overgeslagen technieken-artikelen module exists under src/atlas/
- [ ] scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-010"]) implemented per mission scope
- [ ] src/atlas/ai/providers/transport/createClaudeTransport.ts (de eigenlijke bugfix — retry met backoff vóór terugvallen op een placeholder) implemented per mission scope
- [ ] src/atlas/ai/core/Orchestrator.ts (formatTaskExecutionLog — toont nu duidelijk wanneer een aanroep stil terugviel) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/techniques/index.ts (bevat al de 5 gelukte technieken-artikelen — blijft ongewijzigd) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/technieken-retry/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van techniques/index.ts zodat de 5 al toegepaste artikelen niet worden overschreven) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de stubs van artikelen die deze keer wél lukken) implemented per mission scope
- [ ] Constraint respected: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint respected: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; blijft een artikel te dun of mislukt de aanroep opnieuw, dan wordt dat gerapporteerd met de echte oorzaak (niet de generieke "geen contentPayload"-melding) en blijft de bestaande stub staan
- [ ] Constraint respected: De 5 al toegepaste technieken-artikelen worden niet opnieuw gegenereerd en niet overschreven
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-010 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Zoveel mogelijk van de 17 artikelen tonen echte, leesbare content in de Kennisbibliotheek (categorie technieken) in plaats van een lege pagina — en als er nog artikelen overblijven, is de gerapporteerde reden nu de echte technische oorzaak, niet een onbruikbare generieke melding.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission CONTENT-010
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for CONTENT-010"
- npm run atlas:mission CONTENT-010

## Commands to run before finishing

```bash
npm run atlas:mission CONTENT-010
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Claude instructions

1. Implement this mission under `src/atlas/` using the focus areas above.
2. Follow all Engineering Standards, Architecture Rules, and Constraints.
3. Respect Mission Dependencies — do not rebuild upstream missions unless required.
4. Do **not** write a new Architecture Brief — Atlas already generated the engineering package.
5. Keep changes small, TypeScript strict, and registry-aligned.
6. Complete the Definition of Done checklist before marking the mission done.
7. Run validation commands and ensure Branch Director Release Decision is APPROVED or APPROVED_WITH_NOTES.
8. Fill in `release-notes.md` after implementation.

## Success criteria

Zoveel mogelijk van de 17 artikelen tonen echte, leesbare content in de Kennisbibliotheek (categorie technieken) in plaats van een lege pagina — en als er nog artikelen overblijven, is de gerapporteerde reden nu de echte technische oorzaak, niet een onbruikbare generieke melding.

---

_Generated by Atlas Mission Orchestrator · 2026-07-10T19:35:28.034Z_
