//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",

  // https://nitro.unjs.io/guide/configuration
  runtimeConfig: {
    github: {
      clientId: '',
      clientSecret: '',
      redirectUri: '',
    },
  },

  compatibilityDate: "2024-11-30",
});