// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },

  env: {
    STATS_URL: process.env.STATS_URL,
    STATS_WEBSITE_ID: process.env.STATS_WEBSITE_ID,
  },

  redirects: async () => {
    return [
      {
        source: "/",
        destination: "https://statmonitor.hu/inflacio-kalkulator",
        permanent: true,
      },
    ];
  },
};
export default config;
