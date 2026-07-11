# Validation Plan — BRAIN-007

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **BRAIN-007**
- Title · **Kennis-catalogus in Context Engine verbreden**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:25:22.986Z

## Required commands

```bash
npm run atlas:mission BRAIN-007
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-007
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for BRAIN-007"
- npm run atlas:mission BRAIN-007

## Expected outcome

- Context-snapshots die de Decision Engine voedt bevatten nu echte, onderwerp-relevante kennis uit de gepubliceerde artikelcatalogus in plaats van drie vaste, betekenisloze placeholder-strings.
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
