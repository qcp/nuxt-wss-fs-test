// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxt/ui'],
  nitro: {
    experimental: {
      websocket: true
    },
    devStorage: {
      room: {
        driver: 'fs',
        base: './.data/room'
      },
      user: {
        driver: 'fs',
        base: './.data/user'
      }
    }
  }
})