require("dotenv").config();

const appJson = require("./app.json");

/** Expo config — injects env vars into extra (never commit .env). */
module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
    },
  },
};
