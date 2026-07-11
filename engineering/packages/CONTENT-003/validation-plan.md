# Validation Plan — CONTENT-003

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **CONTENT-003**
- Title · **Kennisartikelen Temperaturen vullen**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-09T19:16:06.594Z

## Required commands

```bash
npm run atlas:mission CONTENT-003
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission CONTENT-003
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for CONTENT-003"
- npm run atlas:mission CONTENT-003

## Expected outcome

- Alle 6 artikelen in de temperaturen-categorie tonen echte, leesbare content in de Kennisbibliotheek in plaats van een lege pagina, geschreven door de echte agent-ploeg.
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
