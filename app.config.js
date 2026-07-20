require("dotenv").config();

const appJson = require("./app.json");

/** Expo config — injects env vars into extra (never commit .env). */
module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
      // Sprint 0.1 · Executive Memory — same mechanism as anthropicApiKey above. Defaults to
      // localhost for web dev (same machine as `npm run atlas:runtime`). For a physical
      // mobile device, set this to the dev machine's LAN IP, e.g.
      // EXECUTIVE_MEMORY_BASE_URL=http://192.168.1.23:8792 — the same IP Expo's own Metro
      // bundler already requires to reach a physical device. See
      // ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md chapter 1.
      executiveMemoryBaseUrl: process.env.EXECUTIVE_MEMORY_BASE_URL ?? "http://localhost:8792",
    },
  },
};
