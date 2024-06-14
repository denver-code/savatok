// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  vite: {
    server: {
      hmr: {
        protocol: 'ws'
      }
    }
  },
  runtimeConfig: {
    public: {
      pocketbase: {
        redirectOptions: {
          login: "/auth/login",
          exclude: ["/"],
        }
      }
    }
  }
})
