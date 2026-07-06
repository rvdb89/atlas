# Architecture Brief — ATLAS-002

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
