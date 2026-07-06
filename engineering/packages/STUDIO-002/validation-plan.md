# Validation Plan — STUDIO-002

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **STUDIO-002**
- Title · **Branch Director Debrief Flow**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-06T21:59:19.427Z

## Required commands

```bash
npm run atlas:mission STUDIO-002
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission STUDIO-002
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for STUDIO-002"
- npm run atlas:mission STUDIO-002

## Expected outcome

- Mission completed successfully.
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
