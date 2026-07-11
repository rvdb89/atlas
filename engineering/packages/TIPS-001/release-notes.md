# Release Notes — TIPS-001

- Mission · **TIPS-001**
- Title · **Tips uitbreiden — 14 nieuwe baktips**
- Atlas · 0.26.0 (brain-005)
- Status · **Pending implementation**

## Summary

_Fill in after sprint completion._

Content-capability's grootste openstaande gat is voor het grootste deel al onderweg (CONTENT-010), maar tips.ts bleef daarbij buiten beeld: 31 losse, korte baktips over 7 categorieën, laatst uitgebreid toen de app werd opgezet. Dit is een bewust apart, kleiner vervolg — tips zijn een heel andere, veel simpelere databron dan de KnowledgeBite-artikelen (één zin, geen secties, geen bronnen, geen links), dus dit gebruikt een eigen, lichte generatie-engine (tipsGenerationEngine.ts) in plaats van de zware copywriter/fact-checker/link-engine-pipeline die daar overkill voor zou zijn. Deze eerste missie voegt 2 nieuwe tips toe aan elk van de 7 bestaande categorieën (14 in totaal) — de bestaande 31 tips blijven volledig ongewijzigd.

## Delivered

- [ ] _List completed deliverables_

## Changed files

- _List new and modified files_

## Validation

- [ ] npm run atlas:mission TIPS-001
- [ ] npm run atlas:audit -- --strict
- [ ] npx tsc --noEmit

## Release decision

- Status · _APPROVED / APPROVED_WITH_NOTES / BLOCKED_
- Push · _YES / NO_

## Follow-up

- _Open items for next mission_
