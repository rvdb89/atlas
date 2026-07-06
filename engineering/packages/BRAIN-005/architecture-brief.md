# Architecture Brief — BRAIN-005

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 9/10
- Selection rationale · Mijn advies is om Orchestration te verbeteren.
Reden: Orchestration is volwassen volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Evolution Engine (ATLAS-001). Mission ID BRAIN-005 provided — evolution assessment confirms alignment. Roadmap context: Atlas understands its capabilities and recommends the next best initiative for the North Star Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected BRAIN-005 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

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
Execution Packages
↓
Claude
↓
Branch Director Review
```

## Mission Metadata

- Mission ID · **BRAIN-005**
- Title · **Capability Registry & Roadmap Intelligence**
- Registry source · engineering/missions/BRAIN-005.mission
- Template · Brain Mission
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-06T22:21:18.034Z

## Engineering Standards

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Deterministic, rule-based orchestration before AI generation
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star

- Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- Atlas interprets natural-language intent and proposes the recommended next initiative
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Execution packages are generated without external brief writing
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

- **ATLAS-000** · Atlas Constitution · _requires_ — Capabilities defined in Constitution
- **ATLAS-001** · Evolution Engine · _requires_ — Evolution scoring uses registry strategic value
- **BRAIN-001** · Planner Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-004** · Decision Engine · _requires_ — Registry feeds Decision Engine recommendations

## Definition of Done

- [ ] Capability Registry & Roadmap Intelligence module exists under src/atlas/
- [ ] Capability Registry with maturity, gaps, systems, initiatives, and strategic value implemented per mission scope
- [ ] Roadmap Intelligence answering where we are weak and what to build next implemented per mission scope
- [ ] Decision Engine integration with Branch Director Dutch advice implemented per mission scope
- [ ] Atlas Studio capability scores for CEO visibility implemented per mission scope
- [ ] Constraint respected: No new meta-frameworks — extend Brain registry pattern
- [ ] Constraint respected: Build on Constitution capabilities and Current State Registry
- [ ] Constraint respected: CEO-facing output uses Branch Director language, not git or CLI terms
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-005 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Atlas answers "Where are we weak?", "What should we build next?", and "Why is this the best next step?"

---

## Detailed Architecture Brief

## Titel

# BRAIN-005 — Capability Registry & Roadmap Intelligence

## Mission Metadata

- Mission ID · **BRAIN-005**
- Title · **Capability Registry & Roadmap Intelligence**
- Template · Brain Mission
- Phase · PHASE 2 — ATLAS BRAIN
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-06T22:21:18.034Z

## Doel

Teach Atlas to understand its own capabilities and recommend the next best initiative using registry-backed roadmap intelligence.

## Scope

Atlas Brain capabilities: planning, memory, context, decision en agents.

### Focus
- Capability Registry with maturity, gaps, systems, initiatives, and strategic value
- Roadmap Intelligence answering where we are weak and what to build next
- Decision Engine integration with Branch Director Dutch advice
- Atlas Studio capability scores for CEO visibility

## Niet doen

- No new meta-frameworks — extend Brain registry pattern
- Build on Constitution capabilities and Current State Registry
- CEO-facing output uses Branch Director language, not git or CLI terms
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
- Implement Capability Registry with maturity, gaps, systems, initiatives, and strategic value using registry-based Atlas patterns.
- Implement Roadmap Intelligence answering where we are weak and what to build next using registry-based Atlas patterns.
- Implement Decision Engine integration with Branch Director Dutch advice using registry-based Atlas patterns.
- Implement Atlas Studio capability scores for CEO visibility using registry-based Atlas patterns.

## Technische eisen

- Clean TypeScript zonder placeholders
- Exports via index.ts barrels
- Bootstrap chain blijft intact
- Implement Capability Registry & Roadmap Intelligence under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver Capability Registry with maturity, gaps, systems, initiatives, and strategic value with rule-based local logic
- Deliver Roadmap Intelligence answering where we are weak and what to build next with rule-based local logic
- Deliver Decision Engine integration with Branch Director Dutch advice with rule-based local logic
- Deliver Atlas Studio capability scores for CEO visibility with rule-based local logic

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
- Mission BRAIN-005 advances Capability Registry & Roadmap Intelligence toward Atlas autonomy

## Definition of Done

- [ ] Capability Registry & Roadmap Intelligence module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Atlas answers "Where are we weak?", "What should we build next?", and "Why is this the best next step?"
- [ ] Constraint gerespecteerd: No new meta-frameworks — extend Brain registry pattern
- [ ] Constraint gerespecteerd: Build on Constitution capabilities and Current State Registry
- [ ] Constraint gerespecteerd: CEO-facing output uses Branch Director language, not git or CLI terms

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert BRAIN-005.md
- npm run atlas:mission BRAIN-005 genereert engineering package
- Mission BRAIN-005 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/BRAIN-005.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor BRAIN-005 gebruiken
- Success criteria: Atlas answers "Where are we weak?", "What should we build next?", and "Why is this the best next step?"

---

_Generated by Atlas Mission Brief Generator · 2026-07-06T22:21:18.034Z_
