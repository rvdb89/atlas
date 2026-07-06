# Architecture Brief — BRAIN-004

## Titel

# BRAIN-004 — Decision Engine

## Mission Metadata

- Mission ID · **BRAIN-004**
- Title · **Decision Engine**
- Template · Brain Mission
- Phase · PHASE 2 — ATLAS BRAIN
- Atlas Version · 0.23.0 (brain-004)
- Generated · 2026-07-06T21:13:13.454Z

## Doel

Build the first reasoning engine of Atlas — transforming human intent into autonomous decisions with explicit WHY.

## Scope

Atlas Brain capabilities: planning, memory, context, decision en agents.

### Focus
- Decision Engine composing Constitution, capabilities, Organization, and Roadmap
- Decision Policies and Decision Registry
- Reasoning layer explaining every recommended initiative
- Execution Package trigger when engineering is required

## Niet doen

- No breaking changes to Evolution Engine or Organizational Model APIs
- Provider-independent Brain module under src/atlas/brain/decision/
- Every future initiative originates from the Decision Engine
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
- Implement Decision Engine composing Constitution, capabilities, Organization, and Roadmap using registry-based Atlas patterns.
- Implement Decision Policies and Decision Registry using registry-based Atlas patterns.
- Implement Reasoning layer explaining every recommended initiative using registry-based Atlas patterns.
- Implement Execution Package trigger when engineering is required using registry-based Atlas patterns.

## Technische eisen

- Clean TypeScript zonder placeholders
- Exports via index.ts barrels
- Bootstrap chain blijft intact
- Implement Decision Engine under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver Decision Engine composing Constitution, capabilities, Organization, and Roadmap with rule-based local logic
- Deliver Decision Policies and Decision Registry with rule-based local logic
- Deliver Reasoning layer explaining every recommended initiative with rule-based local logic
- Deliver Execution Package trigger when engineering is required with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer
- No breaking changes to Evolution Engine or Organizational Model APIs

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution
- Mission BRAIN-004 advances Decision Engine toward Atlas autonomy

## Definition of Done

- [ ] Decision Engine module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] npm run atlas:decide -- "I want Atlas to improve decision making." recommends BRAIN-004 and explains WHY.
- [ ] Constraint gerespecteerd: No breaking changes to Evolution Engine or Organizational Model APIs
- [ ] Constraint gerespecteerd: Provider-independent Brain module under src/atlas/brain/decision/
- [ ] Constraint gerespecteerd: Every future initiative originates from the Decision Engine

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert BRAIN-004.md
- npm run atlas:mission BRAIN-004 genereert engineering package
- Mission BRAIN-004 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/BRAIN-004.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor BRAIN-004 gebruiken
- Success criteria: npm run atlas:decide -- "I want Atlas to improve decision making." recommends BRAIN-004 and explains WHY.

---

_Generated by Atlas Mission Brief Generator · 2026-07-06T21:13:13.454Z_
