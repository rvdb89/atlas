# Architecture Brief — CONTENT-002

## Titel

# CONTENT-002 — Kennisartikelen Hydratatie vullen

## Mission Metadata

- Mission ID · **CONTENT-002**
- Title · **Kennisartikelen Hydratatie vullen**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-08T20:03:50.775Z

## Doel

De categorie "hydratatie" in de Kennisbibliotheek bestaat uit 6 artikelen (hydratatie, bakers-percentage, waterabsorptie, hoge-hydratatie, lage-hydratatie, hydratatie-berekenen) die vandaag alleen een titel hebben — geen samenvatting, geen secties. Dit is één van zes lege categorieën (samen 62 artikelen zonder echte inhoud) die de gebruiker letterlijk leeg ziet in de app. Deze mission pakt de kleinste, best onderbouwde categorie als eerste, echte stap: schrijf publish-klare Nederlandse content voor deze 6 artikelen, met dezelfde kwaliteit en structuur als de al voltooide meel-bloem categorie (zie flour/tarwebloem.ts), en baseer je waar mogelijk op al bestaande, echte hydratatie-kennis die al in de repository staat (painDeCampagneKnowledge.hydrationScience, recipe.hydration percentages) in plaats van alles te verzinnen.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de 6 hydratatie-stubs — vul hier per entry een echt `content: { summary, sections }` veld en zet status op "published" zodra een entry echt gevuld is)
- src/modules/doughbert/knowledge/flour/tarwebloem.ts (kwaliteitsvoorbeeld: een volledig artikel — 8-11 secties via createStandardSection, met een goed geschreven summary — dit is de lat, geen mission om onder te gaan zitten)
- src/modules/doughbert/knowledge/painDeCampagneKnowledge.ts (bevat een echt geschreven hydrationScience-blok — bruikbare, al bestaande feiten over hydratatie, hergebruik deze in plaats van nieuwe cijfers te verzinnen)
- src/modules/doughbert/knowledge/knowledgeBiteContent.ts (createStandardSection, createKnowledgeBiteSection, mergeKnowledgeBiteBody — bestaande helpers, hergebruiken)
- src/modules/doughbert/types/knowledgeBite.ts (KnowledgeBiteSectionId — alleen deze vaste set section-ids gebruiken: what-is-it, properties, comparison, science, when-to-use, when-not-to-use, common-mistakes, doughbert-tip, faq, did-you-know)

## Niet doen

- Verzin geen baktechnische claims die nergens in de repository of in gangbare, algemeen bekende bakkennis onderbouwd zijn — bij twijfel liever een sectie weglaten dan een onjuist feit opnemen
- Gebruik alleen de vaste KnowledgeBiteSectionId-waarden, geen nieuwe section-ids verzinnen
- Zet status alleen op "published" voor een entry die ook echt gevulde sections heeft — nooit blind alles wijzigen
- Raak de mock AI Studio en de publicationStore-pipeline niet aan — dat is een apart, bewust ongebruikt systeem
- Klein en gefocust: dit is alleen de "hydratatie"-categorie (6 artikelen) — de andere vijf lege categorieën (bakwetenschap, technieken, starter, fermentatie, temperaturen) zijn expliciet geen onderdeel van deze mission en volgen later als eigen mission
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
- Implement src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de 6 hydratatie-stubs — vul hier per entry een echt `content: { summary, sections }` veld en zet status op "published" zodra een entry echt gevuld is) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/flour/tarwebloem.ts (kwaliteitsvoorbeeld: een volledig artikel — 8-11 secties via createStandardSection, met een goed geschreven summary — dit is de lat, geen mission om onder te gaan zitten) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/painDeCampagneKnowledge.ts (bevat een echt geschreven hydrationScience-blok — bruikbare, al bestaande feiten over hydratatie, hergebruik deze in plaats van nieuwe cijfers te verzinnen) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/knowledgeBiteContent.ts (createStandardSection, createKnowledgeBiteSection, mergeKnowledgeBiteBody — bestaande helpers, hergebruiken) using registry-based Atlas patterns.
- Implement src/modules/doughbert/types/knowledgeBite.ts (KnowledgeBiteSectionId — alleen deze vaste set section-ids gebruiken: what-is-it, properties, comparison, science, when-to-use, when-not-to-use, common-mistakes, doughbert-tip, faq, did-you-know) using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Kennisartikelen Hydratatie vullen under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de 6 hydratatie-stubs — vul hier per entry een echt `content: { summary, sections }` veld en zet status op "published" zodra een entry echt gevuld is) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/flour/tarwebloem.ts (kwaliteitsvoorbeeld: een volledig artikel — 8-11 secties via createStandardSection, met een goed geschreven summary — dit is de lat, geen mission om onder te gaan zitten) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/painDeCampagneKnowledge.ts (bevat een echt geschreven hydrationScience-blok — bruikbare, al bestaande feiten over hydratatie, hergebruik deze in plaats van nieuwe cijfers te verzinnen) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/knowledgeBiteContent.ts (createStandardSection, createKnowledgeBiteSection, mergeKnowledgeBiteBody — bestaande helpers, hergebruiken) with rule-based local logic
- Deliver src/modules/doughbert/types/knowledgeBite.ts (KnowledgeBiteSectionId — alleen deze vaste set section-ids gebruiken: what-is-it, properties, comparison, science, when-to-use, when-not-to-use, common-mistakes, doughbert-tip, faq, did-you-know) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission CONTENT-002 advances Kennisartikelen Hydratatie vullen toward Atlas autonomy

## Definition of Done

- [ ] Kennisartikelen Hydratatie vullen module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Alle 6 artikelen in de hydratatie-categorie tonen echte, leesbare content in de Kennisbibliotheek in plaats van een lege pagina, met een kwaliteitsniveau vergelijkbaar met de meel-bloem categorie.
- [ ] Constraint gerespecteerd: Verzin geen baktechnische claims die nergens in de repository of in gangbare, algemeen bekende bakkennis onderbouwd zijn — bij twijfel liever een sectie weglaten dan een onjuist feit opnemen
- [ ] Constraint gerespecteerd: Gebruik alleen de vaste KnowledgeBiteSectionId-waarden, geen nieuwe section-ids verzinnen
- [ ] Constraint gerespecteerd: Zet status alleen op "published" voor een entry die ook echt gevulde sections heeft — nooit blind alles wijzigen
- [ ] Constraint gerespecteerd: Raak de mock AI Studio en de publicationStore-pipeline niet aan — dat is een apart, bewust ongebruikt systeem
- [ ] Constraint gerespecteerd: Klein en gefocust: dit is alleen de "hydratatie"-categorie (6 artikelen) — de andere vijf lege categorieën (bakwetenschap, technieken, starter, fermentatie, temperaturen) zijn expliciet geen onderdeel van deze mission en volgen later als eigen mission
- [ ] Constraint gerespecteerd: TypeScript blijft compileren zonder nieuwe errors

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert CONTENT-002.md
- npm run atlas:mission CONTENT-002 genereert engineering package
- Mission CONTENT-002 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/CONTENT-002.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor CONTENT-002 gebruiken
- Success criteria: Alle 6 artikelen in de hydratatie-categorie tonen echte, leesbare content in de Kennisbibliotheek in plaats van een lege pagina, met een kwaliteitsniveau vergelijkbaar met de meel-bloem categorie.

---

_Generated by Atlas Mission Brief Generator · 2026-07-08T20:03:50.775Z_
