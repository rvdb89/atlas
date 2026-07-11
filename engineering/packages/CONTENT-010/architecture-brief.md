# Architecture Brief — CONTENT-010

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 5/10
- Selection rationale · Mijn advies is om Content te verbeteren.
Reden: Content is ontwikkelend volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Atlas Constitution (ATLAS-000). Mission ID CONTENT-010 provided — evolution assessment confirms alignment. Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected CONTENT-010 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

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

- Mission ID · **CONTENT-010**
- Title · **Retry: 17 overgeslagen technieken-artikelen**
- Registry source · engineering/missions/CONTENT-010.mission
- Template · Engineering Mission
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T19:35:28.034Z

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

---

## Detailed Architecture Brief

## Titel

# CONTENT-010 — Retry: 17 overgeslagen technieken-artikelen

## Mission Metadata

- Mission ID · **CONTENT-010**
- Title · **Retry: 17 overgeslagen technieken-artikelen**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-10T19:35:28.033Z

## Doel

Bij CONTENT-007 (technieken) landden maar 5 van de 22 artikelen — een veel hoger uitvalpercentage dan elke andere categorie. Onderzoek wees een echte bug uit (zie BRAIN-010): createClaudeTransport.ts ving elke mislukte Claude-aanroep stil op en verving die door een placeholder, zonder dat dit ergens zichtbaar werd. Vermoedelijke oorzaak: een rate limit na 22 snelle aanroepen zonder pauze. Die bug is nu gefixed (zichtbare foutmelding, automatische retry met backoff, pauze tussen artikelen). Deze mission probeert de 17 overgeslagen artikelen opnieuw.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-010"])
- src/atlas/ai/providers/transport/createClaudeTransport.ts (de eigenlijke bugfix — retry met backoff vóór terugvallen op een placeholder)
- src/atlas/ai/core/Orchestrator.ts (formatTaskExecutionLog — toont nu duidelijk wanneer een aanroep stil terugviel)
- src/modules/doughbert/knowledge/techniques/index.ts (bevat al de 5 gelukte technieken-artikelen — blijft ongewijzigd)
- src/modules/doughbert/knowledge/technieken-retry/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van techniques/index.ts zodat de 5 al toegepaste artikelen niet worden overschreven)
- src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array)
- src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de stubs van artikelen die deze keer wél lukken)

## Niet doen

- Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; blijft een artikel te dun of mislukt de aanroep opnieuw, dan wordt dat gerapporteerd met de echte oorzaak (niet de generieke "geen contentPayload"-melding) en blijft de bestaande stub staan
- De 5 al toegepaste technieken-artikelen worden niet opnieuw gegenereerd en niet overschreven
- TypeScript blijft compileren zonder nieuwe errors
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
- Implement scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-010"]) using registry-based Atlas patterns.
- Implement src/atlas/ai/providers/transport/createClaudeTransport.ts (de eigenlijke bugfix — retry met backoff vóór terugvallen op een placeholder) using registry-based Atlas patterns.
- Implement src/atlas/ai/core/Orchestrator.ts (formatTaskExecutionLog — toont nu duidelijk wanneer een aanroep stil terugviel) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/techniques/index.ts (bevat al de 5 gelukte technieken-artikelen — blijft ongewijzigd) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/technieken-retry/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van techniques/index.ts zodat de 5 al toegepaste artikelen niet worden overschreven) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de stubs van artikelen die deze keer wél lukken) using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Retry: 17 overgeslagen technieken-artikelen under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-010"]) with rule-based local logic
- Deliver src/atlas/ai/providers/transport/createClaudeTransport.ts (de eigenlijke bugfix — retry met backoff vóór terugvallen op een placeholder) with rule-based local logic
- Deliver src/atlas/ai/core/Orchestrator.ts (formatTaskExecutionLog — toont nu duidelijk wanneer een aanroep stil terugviel) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/techniques/index.ts (bevat al de 5 gelukte technieken-artikelen — blijft ongewijzigd) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/technieken-retry/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van techniques/index.ts zodat de 5 al toegepaste artikelen niet worden overschreven) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de stubs van artikelen die deze keer wél lukken) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer
- Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; blijft een artikel te dun of mislukt de aanroep opnieuw, dan wordt dat gerapporteerd met de echte oorzaak (niet de generieke "geen contentPayload"-melding) en blijft de bestaande stub staan

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission CONTENT-010 advances Retry: 17 overgeslagen technieken-artikelen toward Atlas autonomy

## Definition of Done

- [ ] Retry: 17 overgeslagen technieken-artikelen module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Zoveel mogelijk van de 17 artikelen tonen echte, leesbare content in de Kennisbibliotheek (categorie technieken) in plaats van een lege pagina — en als er nog artikelen overblijven, is de gerapporteerde reden nu de echte technische oorzaak, niet een onbruikbare generieke melding.
- [ ] Constraint gerespecteerd: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint gerespecteerd: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; blijft een artikel te dun of mislukt de aanroep opnieuw, dan wordt dat gerapporteerd met de echte oorzaak (niet de generieke "geen contentPayload"-melding) en blijft de bestaande stub staan
- [ ] Constraint gerespecteerd: De 5 al toegepaste technieken-artikelen worden niet opnieuw gegenereerd en niet overschreven
- [ ] Constraint gerespecteerd: TypeScript blijft compileren zonder nieuwe errors

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert CONTENT-010.md
- npm run atlas:mission CONTENT-010 genereert engineering package
- Mission CONTENT-010 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/CONTENT-010.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor CONTENT-010 gebruiken
- Success criteria: Zoveel mogelijk van de 17 artikelen tonen echte, leesbare content in de Kennisbibliotheek (categorie technieken) in plaats van een lege pagina — en als er nog artikelen overblijven, is de gerapporteerde reden nu de echte technische oorzaak, niet een onbruikbare generieke melding.

---

_Generated by Atlas Mission Brief Generator · 2026-07-10T19:35:28.034Z_
