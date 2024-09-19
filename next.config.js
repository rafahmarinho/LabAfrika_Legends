/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    IMAGE_SHINY_PATH: process.env.IMAGE_SHINY_PATH,
    IMAGE_POKEMON_PATH: process.env.IMAGE_POKEMON_PATH,
    IMAGE_PATH: process.env.IMAGE_PATH,
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
    PAGBANK_ENDPOINT: process.env.PAGBANK_ENDPOINT,
    PAGBANK_TOKEN: process.env.PAGBANK_TOKEN,
    PAGBANK_WEBHOOK_URL: process.env.PAGBANK_WEBHOOK_URL,
    TWITCH_PARENT_URL: process.env.TWITCH_PARENT_URL,
    PAGBANK_REDIRECT_URL: process.env.PAGBANK_REDIRECT_URL,
  },
};

module.exports = nextConfig;
