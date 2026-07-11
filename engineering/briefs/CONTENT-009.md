# Architecture Brief — CONTENT-009

## Titel

# CONTENT-009 — Overgeslagen artikel Zure starter alsnog schrijven

## Mission Metadata

- Mission ID · **CONTENT-009**
- Title · **Overgeslagen artikel Zure starter alsnog schrijven**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:29:43.085Z

## Doel

Bij CONTENT-005 (starter) haalden 8 van de 9 artikelen de publicatiedrempel, maar "zure starter" bleef te dun en werd overgeslagen — CONTENT-005 zelf staat al als "toegepast" geregistreerd, dus dit ene artikel wordt niet vanzelf opnieuw geprobeerd. Deze mission is een gerichte retry van precies dat ene artikel, via dezelfde echte copywriter/fact-checker/link-engine agent-ploeg als de rest van de content-missies.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-009"])
- src/modules/doughbert/knowledge/starter/index.ts (bevat al de 8 andere starter-artikelen — blijft ongewijzigd)
- src/modules/doughbert/knowledge/starter-zure-starter/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van starter/index.ts zodat de al toegepaste 8 artikelen niet worden overschreven)
- src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array)
- src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub voor zure-starter)

## Niet doen

- Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- Alleen als het artikel de publicatiedrempel haalt (minimaal 3 echte secties + samenvatting) wordt het meegenomen; blijft het te dun, dan wordt dat gerapporteerd en blijft de bestaande stub gewoon staan
- De 8 al toegepaste starter-artikelen worden niet opnieuw gegenereerd en niet overschreven
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
- Implement scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-009"]) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/starter/index.ts (bevat al de 8 andere starter-artikelen — blijft ongewijzigd) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/starter-zure-starter/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van starter/index.ts zodat de al toegepaste 8 artikelen niet worden overschreven) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub voor zure-starter) using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Overgeslagen artikel Zure starter alsnog schrijven under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-009"]) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/starter/index.ts (bevat al de 8 andere starter-artikelen — blijft ongewijzigd) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/starter-zure-starter/index.ts (nieuw bestand, wordt aangemaakt — bewust apart van starter/index.ts zodat de al toegepaste 8 artikelen niet worden overschreven) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub voor zure-starter) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer
- Alleen als het artikel de publicatiedrempel haalt (minimaal 3 echte secties + samenvatting) wordt het meegenomen; blijft het te dun, dan wordt dat gerapporteerd en blijft de bestaande stub gewoon staan

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission CONTENT-009 advances Overgeslagen artikel Zure starter alsnog schrijven toward Atlas autonomy

## Definition of Done

- [ ] Overgeslagen artikel Zure starter alsnog schrijven module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Het zure-starter-artikel toont echte, leesbare content in de Kennisbibliotheek (categorie starter) in plaats van een lege pagina, geschreven door de echte agent-ploeg.
- [ ] Constraint gerespecteerd: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint gerespecteerd: Alleen als het artikel de publicatiedrempel haalt (minimaal 3 echte secties + samenvatting) wordt het meegenomen; blijft het te dun, dan wordt dat gerapporteerd en blijft de bestaande stub gewoon staan
- [ ] Constraint gerespecteerd: De 8 al toegepaste starter-artikelen worden niet opnieuw gegenereerd en niet overschreven
- [ ] Constraint gerespecteerd: TypeScript blijft compileren zonder nieuwe errors

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert CONTENT-009.md
- npm run atlas:mission CONTENT-009 genereert engineering package
- Mission CONTENT-009 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/CONTENT-009.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor CONTENT-009 gebruiken
- Success criteria: Het zure-starter-artikel toont echte, leesbare content in de Kennisbibliotheek (categorie starter) in plaats van een lege pagina, geschreven door de echte agent-ploeg.

---

_Generated by Atlas Mission Brief Generator · 2026-07-10T21:29:43.086Z_
