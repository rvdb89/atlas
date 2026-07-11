# Voorgestelde implementatie — BRAIN-003 · Context Engine

**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), en verwijder deze proposed-changes/ map daarna.

## Echte context meegegeven aan Claude
- `engineering/briefs/BRAIN-003.md` (echte inhoud gelezen van disk)

## Samenvatting
Nieuwe, self-contained Context Engine module toegevoegd onder src/atlas/context/ met ContextRegistry, ContextBuilder en ContextEngine die best-effort snapshots (entities, knowledge, workflows, health) leveren; integratie met de Decision Engine kon niet worden doorgevoerd omdat de bestaande Decision Engine-broncode niet in existingFiles zat.

## Voorgestelde bestanden (1)
- **create** `src/atlas/context/index.ts` — Geen reden opgegeven.

## Risico's
- Er waren geen bronbestanden van de bestaande Decision Engine, Memory Engine of bootstrap-chain beschikbaar in existingFiles, dus de daadwerkelijke koppeling (Decision Engine roept ContextEngine aan vóór het self-review verdict) is nog niet doorgevoerd.
- De entity- en knowledge-registries zijn nog niet aangesloten als echte ContextProvider-implementaties; snapshots zullen momenteel altijd 'empty' health tonen totdat providers geregistreerd worden.
- Zonder zicht op src/atlas/index.ts of de bootstrap-file kon de barrel-export en bootstrap-integratie niet veilig worden gewijzigd.

## Vervolgstap
Een mens moet: (1) de bestaande src/atlas/index.ts, de Memory Engine (BRAIN-002) en de Decision Engine broncode aanleveren zodat ContextEngine daadwerkelijk in de bootstrap-chain en de self-review flow van de Decision Engine gehaakt kan worden, (2) reële ContextProvider-implementaties schrijven die de bestaande entity/knowledge/workflow catalogi ontsluiten in plaats van lege arrays, en (3) npx tsc --noEmit en npm run atlas:mission BRAIN-003 draaien om de integratie te bevestigen.