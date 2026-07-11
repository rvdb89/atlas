# Voorgestelde implementatie — BRAIN-002 · Memory Engine

**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), en verwijder deze proposed-changes/ map daarna.

## Echte context meegegeven aan Claude
- `src/atlas/ai/memory/interfaces.ts` (echte inhoud gelezen van disk)
- `src/atlas/ai/memory/store.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/MemoryContext.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/MemoryEngine.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/MemoryRegistry.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/MemorySearch.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/MemoryStore.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/bootstrap.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/index.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/memory.types.ts` (echte inhoud gelezen van disk)
- `scripts/atlas-runtime.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/decision/AutonomousDecision.ts` (echte inhoud gelezen van disk)
- `src/atlas/brain/memory/workflowMemory.ts` (echte inhoud gelezen van disk)
- `engineering/briefs/BRAIN-002.md` (echte inhoud gelezen van disk)

## Samenvatting
De Memory Engine module (opslag, registry, context, search, workflow-memory, persistence via atlas-runtime.ts) is al volledig geïmplementeerd en gebruikt reports/memory/store.json als enige persistente bron; ik voeg alleen het echt ontbrekende stukje toe: lokale, provider-onafhankelijke semantische recall bovenop de bestaande keyword-search, zonder de bestaande persistence-wrapper te dupliceren.

## Voorgestelde bestanden (2)
- **create** `src/atlas/brain/memory/MemorySemanticSearch.ts` — Geen reden opgegeven.
- **modify** `src/atlas/brain/memory/MemoryEngine.ts` — Geen reden opgegeven.

## Risico's
- De term-frequency-cosine aanpak is geen echte vector-embedding (geen semantisch model), dus synoniemen zonder gedeelde woordstammen worden nog steeds gemist
- semanticSearchMemory doorzoekt de volledige provider-lijst zonder paginatie, wat bij een zeer grote memory-store (duizenden entries) een cpu-piek kan geven
- De nieuwe methode is nog niet aangeroepen vanuit AutonomousDecision.ts of workflowMemory.ts, dus de daadwerkelijke winst is pas zichtbaar zodra een caller hem gebruikt

## Vervolgstap
Overweeg om recallRecentDecisions() in AutonomousDecision.ts (optioneel) ook semanticSearchMemory te laten gebruiken naast het huidige type-based filter, zodat de Decision Engine ook conceptueel gerelateerde eerdere verdicts terugvindt, niet alleen de laatste van type 'decision'; controleer daarnaast of reports/memory/store.json in productie al reële entries bevat om te bevestigen dat de bestaande persistence-wrapper in atlas-runtime.ts inderdaad blijft groeien na restarts.