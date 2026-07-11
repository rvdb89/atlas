# Voorgestelde implementatie — ENG-006B · Engineering Package Structure

**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), en verwijder deze proposed-changes/ map daarna.

## Echte context meegegeven aan Claude
- `scripts/atlas/missionPackage.ts` (echte inhoud gelezen van disk)
- `engineering/briefs/ENG-006B.md` (echte inhoud gelezen van disk)

## Samenvatting
De kernfunctionaliteit van deze missie lijkt al opgeleverd: scripts/atlas/missionPackage.ts orchestreert al een compleet Engineering Package (manifest, Claude entrypoint, legacy brief, release notes, latest-package.json) via @/atlas/engineering/mission-orchestrator, en engineering/briefs/ENG-006B.md toont dat dit al minstens één keer succesvol is gedraaid. Ik stel geen nieuwe of parallelle implementatie voor omdat dat dubbel werk zou zijn zonder de bestaande orchestrator-code te zien.

## Voorgestelde bestanden (0)
_Geen bestanden voorgesteld._

## Risico's
- src/atlas/engineering/mission-orchestrator.ts (de kernmodule die EngineeringPackage, manifest, artifacts en brief genereert) staat niet in existingFiles en niet in missingContextPaths, dus ik kan niet met zekerheid vaststellen of Validation Plan en Audit Checklist al als losse artifacts in pkg.artifacts zitten
- Blind wijzigen van missionPackage.ts zonder de exacte vorm van EngineeringPackage/serializePackageManifest te kennen kan de bestaande, werkende pipeline breken
- Er is risico op verwarring omdat engineering/briefs/ENG-006B.md al een eerder gegenereerde brief bevat met een andere Atlas-versie (0.26.0 vs 0.22.0), wat duidt op meerdere eerdere runs van dezelfde missie

## Vervolgstap
Controleer de inhoud van src/atlas/engineering/mission-orchestrator.ts om te bevestigen dat pkg.artifacts al expliciet een Validation Plan en Audit Checklist bestand bevat naast manifest, brief en release notes; ontbreekt een van deze twee, dan volstaat een kleine gerichte uitbreiding van die generator in plaats van een nieuw pad. Draai daarna npm run atlas:mission ENG-006B en npm run atlas:audit -- --strict om te verifiëren dat alle Definition of Done items al afvinkbaar zijn voordat er nieuwe code wordt toegevoegd.