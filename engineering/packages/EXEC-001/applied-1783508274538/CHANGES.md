# Voorgestelde implementatie — EXEC-001 · Execution Engine

**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), en verwijder deze proposed-changes/ map daarna.

## Echte context meegegeven aan Claude
- `scripts/atlas/executionEngine.ts` (echte inhoud gelezen van disk)
- `scripts/atlas-execute.ts` (echte inhoud gelezen van disk)
- `scripts/atlas/applyEngine.ts` (echte inhoud gelezen van disk)
- `scripts/atlas-apply.ts` (echte inhoud gelezen van disk)
- `engineering/briefs/EXEC-001.md` (echte inhoud gelezen van disk)

## Samenvatting
De Execution en Apply Engine bestonden al volledig; de ontbrekende schakel was de automatische local-only apply-bridge die de CEO Inbox 'Approve'-knop moet aanroepen, dus die is nu toegevoegd als losstaand, herbruikbaar module.

## Voorgestelde bestanden (1)
- **create** `scripts/atlas/applyBridge.ts` — Implementeert de nog ontbrekende automatische local-only apply-bridge (127.0.0.1:8791/apply) bovenop de al bestaande, veilige applyProposedChanges-logica.

## Risico's
- startApplyBridge() wordt nog niet automatisch aangeroepen — zonder wiring in atlas-runtime.ts blijft de CEO Inbox 'Approve'-knop niet functioneel voor package-review items.
- De server valideert alleen method+pad+missionId-aanwezigheid; verdere input-hardening (bv. rate limiting, request size limit) is niet toegevoegd om de scope klein te houden.

## Vervolgstap
Controleer scripts/atlas-runtime.ts (niet meegeleverd in existingFiles) en roep daar startApplyBridge() aan bij opstarten van de achtergrond-loop, en verifieer dat de Atlas Control CEO Inbox 'Approve'-knop voor package-review items een POST naar http://127.0.0.1:8791/apply met { missionId } doet; test execution en git automation blijven openstaande scope-items voor een vervolgmissie.