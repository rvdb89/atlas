# Architecture Brief — BRAIN-001

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 9/10
- Selection rationale · Mission ID BRAIN-001 provided — evolution assessment confirms alignment. Roadmap context: Planning capability enables goal decomposition and execution queues Selected by evolution value score — not static roadmap priority.

## Atlas Inference Pipeline

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
Engineering Packages
↓
Claude
↓
Atlas Auditor
```

## Mission Metadata

- Mission ID · **BRAIN-001**
- Title · **Planner Engine**
- Registry source · engineering/missions/BRAIN-001.mission
- Template · Brain Mission
- Atlas · 0.21.0 (atlas-002)
- Generated · 2026-07-06T20:33:58.165Z

## Engineering Standards

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Deterministic, rule-based orchestration before AI generation
- Atlas Auditor validates whether work advances the North Star
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star

- Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Engineering Packages only when software work is required.
- Atlas interprets natural-language intent and proposes the next mission
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Engineering packages are generated without external brief writing
- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution

## Architecture Rules

- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- Brain modules blijven provider-onafhankelijk
- Geen Claude- of Doughbert-logica in brain core

## Mission Dependencies

- **ATLAS-000** · Atlas Constitution · _requires_ — Constitution defines planning capability
- **ATLAS-001** · Evolution Engine · _requires_ — Planning missions pass through Evolution Engine

## Definition of Done

- [ ] Planner Engine module exists under src/atlas/
- [ ] Planner registry and engine hardening implemented per mission scope
- [ ] Planning capability in Decision Framework roadmap implemented per mission scope
- [ ] Command Center planner visibility implemented per mission scope
- [ ] Integration with context and memory layers implemented per mission scope
- [ ] Constraint respected: Provider-independent Brain module
- [ ] Constraint respected: No Doughbert logic in generic planner core
- [ ] Constraint respected: Registry pattern for planner extensions
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:decide -- "I want Atlas to become better at planning." recommends BRAIN-001 and generates Engineering Package.

---

## Detailed Architecture Brief

## Titel

# BRAIN-001 — Planner Engine

## Mission Metadata

- Mission ID · **BRAIN-001**
- Title · **Planner Engine**
- Template · Brain Mission
- Phase · PHASE 2 — ATLAS BRAIN
- Atlas Version · 0.21.0 (atlas-002)
- Generated · 2026-07-06T20:33:58.165Z

## Doel

Extend Atlas Brain planning capability for goal decomposition and execution queues.

## Scope

Atlas Brain capabilities: planning, memory, context, decision en agents.

### Focus
- Planner registry and engine hardening
- Planning capability in Decision Framework roadmap
- Command Center planner visibility
- Integration with context and memory layers

## Niet doen

- Provider-independent Brain module
- No Doughbert logic in generic planner core
- Registry pattern for planner extensions
- Geen breaking changes
- Geen ongevraagde refactors
- Geen externe database zonder expliciete opdracht

## Architectuur

### Principes
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- Brain modules blijven provider-onafhankelijk
- Geen Claude- of Doughbert-logica in brain core

### Mission Architecture
- Implement Planner registry and engine hardening using registry-based Atlas patterns.
- Implement Planning capability in Decision Framework roadmap using registry-based Atlas patterns.
- Implement Command Center planner visibility using registry-based Atlas patterns.
- Implement Integration with context and memory layers using registry-based Atlas patterns.

## Technische eisen

- Clean TypeScript zonder placeholders
- Exports via index.ts barrels
- Bootstrap chain blijft intact
- Implement Planner Engine under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver Planner registry and engine hardening with rule-based local logic
- Deliver Planning capability in Decision Framework roadmap with rule-based local logic
- Deliver Command Center planner visibility with rule-based local logic
- Deliver Integration with context and memory layers with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution
- Mission BRAIN-001 advances Planner Engine toward Atlas autonomy

## Definition of Done

- [ ] Planner Engine module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] npm run atlas:decide -- "I want Atlas to become better at planning." recommends BRAIN-001 and generates Engineering Package.
- [ ] Constraint gerespecteerd: Provider-independent Brain module
- [ ] Constraint gerespecteerd: No Doughbert logic in generic planner core
- [ ] Constraint gerespecteerd: Registry pattern for planner extensions

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert BRAIN-001.md
- npm run atlas:mission BRAIN-001 genereert engineering package
- Mission BRAIN-001 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/BRAIN-001.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor BRAIN-001 gebruiken
- Success criteria: npm run atlas:decide -- "I want Atlas to become better at planning." recommends BRAIN-001 and generates Engineering Package.

---

_Generated by Atlas Mission Brief Generator · 2026-07-06T20:33:58.165Z_
