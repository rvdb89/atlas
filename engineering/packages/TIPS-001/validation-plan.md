# Validation Plan — TIPS-001

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **TIPS-001**
- Title · **Tips uitbreiden — 14 nieuwe baktips**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:11:35.458Z

## Required commands

```bash
npm run atlas:mission TIPS-001
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission TIPS-001
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for TIPS-001"
- npm run atlas:mission TIPS-001

## Expected outcome

- 14 nieuwe, unieke, publiceerbare tips liggen klaar als reviewbaar voorstel in de CEO Inbox, verdeeld over alle 7 bestaande categorieën, zonder dat er ook maar één bestaande tip is aangeraakt.
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
