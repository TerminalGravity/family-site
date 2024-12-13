// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  app: {
    head: {
      title: 'Family Dinner Site',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Family dinner scheduling and engagement website' }
      ]
    }
  },

  devtools: { enabled: true },

  typescript: {
    strict: true
  },

  image: {
    quality: 80,
    format: ['webp']
  },

  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './data'
      }
    }
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL
  },

  build: {
    transpile: ['trpc-nuxt']
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-12-12'
})