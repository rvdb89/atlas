# Execution Package — TIPS-001

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Review needed (0/10)

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
- **North Star aligned:** Yes (7/10)
- **Selected mission:** TIPS-001
- **Recommended Next Initiative:** ATLAS-001

Mijn advies is om Content te verbeteren.
Reden: Content is ontwikkelend volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Atlas Constitution (ATLAS-000). Mission ID TIPS-001 provided — evolution assessment confirms alignment. Selected by evolution value score — not static roadmap priority. North Star alignment score: 7/10. Selected TIPS-001 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 85%. Developing: Memory, Context, Planning, Execution, Content. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Content (25% gap), Context (10% gap), Orchestration (10% gap), Memory (7% gap)
- **Highest value:** Content

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 10 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 4 platform gap(s) identified
- **Recommended Evolution** (pass) — TIPS-001 · TIPS-001
- **Mission Registry** (pass) — TIPS-001 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
TIPS-001
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

- **Mission ID:** TIPS-001
- **Title:** Tips uitbreiden — 14 nieuwe baktips
- **Registry source:** engineering/missions/TIPS-001.mission
- **Template:** engineering
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-10T21:11:35.458Z

## Goal

Content-capability's grootste openstaande gat is voor het grootste deel al onderweg (CONTENT-010), maar tips.ts bleef daarbij buiten beeld: 31 losse, korte baktips over 7 categorieën, laatst uitgebreid toen de app werd opgezet. Dit is een bewust apart, kleiner vervolg — tips zijn een heel andere, veel simpelere databron dan de KnowledgeBite-artikelen (één zin, geen secties, geen bronnen, geen links), dus dit gebruikt een eigen, lichte generatie-engine (tipsGenerationEngine.ts) in plaats van de zware copywriter/fact-checker/link-engine-pipeline die daar overkill voor zou zijn. Deze eerste missie voegt 2 nieuwe tips toe aan elk van de 7 bestaande categorieën (14 in totaal) — de bestaande 31 tips blijven volledig ongewijzigd.

## Implementation focus

- scripts/atlas/tipsGenerationEngine.ts (nieuw — TIP_MISSIONS["TIPS-001"], runTipsGenerationEngine)
- src/atlas/ai/types/index.ts (nieuw taaktype "tips.write" toegevoegd aan AtlasTaskType)
- src/atlas/ai/tasks/routes.ts (route voor tips.write — copywriter, klein maxTokens-budget, geen zware pipeline)
- src/atlas/ai/providers/provider-config.ts (TASK_PROVIDER_CONFIG + CLAUDE_LIVE_TASKS-entry voor tips.write — dit is de tabel die daadwerkelijk wordt toegepast, niet routes.ts alleen, zie de knowledge.write-toelichting in hetzelfde bestand)
- src/atlas/ai/providers/ClaudeProvider.ts (tips.write toegevoegd aan de live-Claude-taken van de echte provider)
- src/atlas/ai/prompts/tips/index.ts (nieuw — tips.write.v1 prompt, gericht op één zin, 40-160 tekens, geen herhaling van bestaande tips)
- src/atlas/ai/prompts/library.ts (registreert TIPS_PROMPTS + tips.write in TASK_PROMPT_IDS)
- src/modules/doughbert/tips/tips.ts (doelbestand — alleen aanvullen, nooit bestaande tips overschrijven)
- scripts/atlas-runtime.ts (dispatch: isTipsMission(missionId) routeert naar runTipsGenerationEngine, naast de bestaande content- en generieke-executie-branch)

## Constraints

- De bestaande 31 tips in tips.ts worden woordelijk bewaard — deterministische serialisatie, geen AI-herschrijving van het hele bestand
- Nieuwe tips die inhoudelijk overlappen met een bestaande tip (exacte of bijna-exacte tekst) worden stil overgeslagen, niet toegevoegd als duplicaat
- Eén gebundelde AI-aanroep per categorie (niet per tip) om het aantal aanroepen laag te houden
- Draait via dezelfde CEO Inbox/Apply Engine-flow als elke andere missie — geen enkele tip wordt automatisch toegepast zonder goedkeuring
- Wordt niet meteen getriggerd zolang CONTENT-010 nog in de wachtrij/uitvoering staat — deze missie staat klaar voor de eerstvolgende vrije cyclus, niet gedwongen ertussendoor

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

_No upstream mission dependencies inferred._

## Definition of Done

- [ ] Tips uitbreiden — 14 nieuwe baktips module exists under src/atlas/
- [ ] scripts/atlas/tipsGenerationEngine.ts (nieuw — TIP_MISSIONS["TIPS-001"], runTipsGenerationEngine) implemented per mission scope
- [ ] src/atlas/ai/types/index.ts (nieuw taaktype "tips.write" toegevoegd aan AtlasTaskType) implemented per mission scope
- [ ] src/atlas/ai/tasks/routes.ts (route voor tips.write — copywriter, klein maxTokens-budget, geen zware pipeline) implemented per mission scope
- [ ] src/atlas/ai/providers/provider-config.ts (TASK_PROVIDER_CONFIG + CLAUDE_LIVE_TASKS-entry voor tips.write — dit is de tabel die daadwerkelijk wordt toegepast, niet routes.ts alleen, zie de knowledge.write-toelichting in hetzelfde bestand) implemented per mission scope
- [ ] src/atlas/ai/providers/ClaudeProvider.ts (tips.write toegevoegd aan de live-Claude-taken van de echte provider) implemented per mission scope
- [ ] src/atlas/ai/prompts/tips/index.ts (nieuw — tips.write.v1 prompt, gericht op één zin, 40-160 tekens, geen herhaling van bestaande tips) implemented per mission scope
- [ ] src/atlas/ai/prompts/library.ts (registreert TIPS_PROMPTS + tips.write in TASK_PROMPT_IDS) implemented per mission scope
- [ ] src/modules/doughbert/tips/tips.ts (doelbestand — alleen aanvullen, nooit bestaande tips overschrijven) implemented per mission scope
- [ ] scripts/atlas-runtime.ts (dispatch: isTipsMission(missionId) routeert naar runTipsGenerationEngine, naast de bestaande content- en generieke-executie-branch) implemented per mission scope
- [ ] Constraint respected: De bestaande 31 tips in tips.ts worden woordelijk bewaard — deterministische serialisatie, geen AI-herschrijving van het hele bestand
- [ ] Constraint respected: Nieuwe tips die inhoudelijk overlappen met een bestaande tip (exacte of bijna-exacte tekst) worden stil overgeslagen, niet toegevoegd als duplicaat
- [ ] Constraint respected: Eén gebundelde AI-aanroep per categorie (niet per tip) om het aantal aanroepen laag te houden
- [ ] Constraint respected: Draait via dezelfde CEO Inbox/Apply Engine-flow als elke andere missie — geen enkele tip wordt automatisch toegepast zonder goedkeuring
- [ ] Constraint respected: Wordt niet meteen getriggerd zolang CONTENT-010 nog in de wachtrij/uitvoering staat — deze missie staat klaar voor de eerstvolgende vrije cyclus, niet gedwongen ertussendoor
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission TIPS-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] 14 nieuwe, unieke, publiceerbare tips liggen klaar als reviewbaar voorstel in de CEO Inbox, verdeeld over alle 7 bestaande categorieën, zonder dat er ook maar één bestaande tip is aangeraakt.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission TIPS-001
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for TIPS-001"
- npm run atlas:mission TIPS-001

## Commands to run before finishing

```bash
npm run atlas:mission TIPS-001
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

14 nieuwe, unieke, publiceerbare tips liggen klaar als reviewbaar voorstel in de CEO Inbox, verdeeld over alle 7 bestaande categorieën, zonder dat er ook maar één bestaande tip is aangeraakt.

---

_Generated by Atlas Mission Orchestrator · 2026-07-10T21:11:35.458Z_
