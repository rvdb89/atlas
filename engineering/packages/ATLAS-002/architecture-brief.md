# Architecture Brief — ATLAS-002

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 9/10
- Selection rationale · Mission ID ATLAS-002 provided — evolution assessment confirms alignment. Roadmap context: Atlas becomes Branch Director — routing intent to departments, not just code Selected by evolution value score — not static roadmap priority.

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

- Mission ID · **ATLAS-002**
- Title · **Organizational Model**
- Registry source · engineering/missions/ATLAS-002.mission
- Template · Engineering Mission
- Atlas · 0.21.0 (atlas-002)
- Generated · 2026-07-06T20:33:58.547Z

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

## Architecture Rules

- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

## Mission Dependencies

- **ATLAS-000** · Atlas Constitution · _requires_ — Organizational Model extends Constitution identity
- **ATLAS-001** · Evolution Engine · _requires_ — Evolution complements organizational routing

## Definition of Done

- [ ] Organizational Model module exists under src/atlas/
- [ ] Organizational Model under src/atlas/organization/ implemented per mission scope
- [ ] Leadership hierarchy: Robbert → ChatGPT → Atlas → Departments → Workers implemented per mission scope
- [ ] Eight AI departments with worker assignments implemented per mission scope
- [ ] Intent routing: Capability → Department → Worker → Execution Plan implemented per mission scope
- [ ] Engineering Package only when software work is required implemented per mission scope
- [ ] Constitution updated with organizational identity implemented per mission scope
- [ ] Constraint respected: ChatGPT defines architecture only — never manages workers
- [ ] Constraint respected: Every AI Worker reports to Atlas
- [ ] Constraint respected: TypeScript compiles clean
- [ ] Constraint respected: Atlas Auditor approves
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission ATLAS-002 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:organize -- "I want Atlas to improve my Instagram growth." routes to Marketing department with execution plan — no Engineering Package unless software is required.

---

## Detailed Architecture Brief

## Titel

# ATLAS-002 — Organizational Model

## Mission Metadata

- Mission ID · **ATLAS-002**
- Title · **Organizational Model**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.21.0 (atlas-002)
- Generated · 2026-07-06T20:33:58.547Z

## Doel

Atlas is no longer an Engineering Manager. Atlas becomes the Branch Director (Vestigingsdirecteur) of the Robbert AI Organization — routing intent to AI departments and workers.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- Organizational Model under src/atlas/organization/
- Leadership hierarchy: Robbert → ChatGPT → Atlas → Departments → Workers
- Eight AI departments with worker assignments
- Intent routing: Capability → Department → Worker → Execution Plan
- Engineering Package only when software work is required
- Constitution updated with organizational identity

## Niet doen

- ChatGPT defines architecture only — never manages workers
- Every AI Worker reports to Atlas
- TypeScript compiles clean
- Atlas Auditor approves
- Geen breaking changes
- Geen ongevraagde refactors
- Geen externe database zonder expliciete opdracht

## Architectuur

### Principes
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

### Mission Architecture
- Implement Organizational Model under src/atlas/organization/ using registry-based Atlas patterns.
- Implement Leadership hierarchy: Robbert → ChatGPT → Atlas → Departments → Workers using registry-based Atlas patterns.
- Implement Eight AI departments with worker assignments using registry-based Atlas patterns.
- Implement Intent routing: Capability → Department → Worker → Execution Plan using registry-based Atlas patterns.
- Implement Engineering Package only when software work is required using registry-based Atlas patterns.
- Implement Constitution updated with organizational identity using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Organizational Model under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver Organizational Model under src/atlas/organization/ with rule-based local logic
- Deliver Leadership hierarchy: Robbert → ChatGPT → Atlas → Departments → Workers with rule-based local logic
- Deliver Eight AI departments with worker assignments with rule-based local logic
- Deliver Intent routing: Capability → Department → Worker → Execution Plan with rule-based local logic
- Deliver Engineering Package only when software work is required with rule-based local logic
- Deliver Constitution updated with organizational identity with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission ATLAS-002 advances Organizational Model toward Atlas autonomy

## Definition of Done

- [ ] Organizational Model module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] npm run atlas:organize -- "I want Atlas to improve my Instagram growth." routes to Marketing department with execution plan — no Engineering Package unless software is required.
- [ ] Constraint gerespecteerd: ChatGPT defines architecture only — never manages workers
- [ ] Constraint gerespecteerd: Every AI Worker reports to Atlas
- [ ] Constraint gerespecteerd: TypeScript compiles clean
- [ ] Constraint gerespecteerd: Atlas Auditor approves

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert ATLAS-002.md
- npm run atlas:mission ATLAS-002 genereert engineering package
- Mission ATLAS-002 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/ATLAS-002.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor ATLAS-002 gebruiken
- Success criteria: npm run atlas:organize -- "I want Atlas to improve my Instagram growth." routes to Marketing department with execution plan — no Engineering Package unless software is required.

---

_Generated by Atlas Mission Brief Generator · 2026-07-06T20:33:58.547Z_
