import { languages, type CodeName } from './types/locale';


export default defineNuxtConfig({
    devtools: { enabled: true },

    css: ['~/assets/styles/root.scss'],

    modules: [
        '@pinia/nuxt',
        '@nuxtjs/i18n',
        'nuxt-mongoose'
    ],

    runtimeConfig: {
        tmdbApiKey: ''
    },

    pinia: {
        storesDirs: ['./stores/**']
    },

    components: [
        {
            path: '~/components/ui',
            pathPrefix: false,
            prefix: 'UI'
        }
    ],

    mongoose: {
        uri: process.env.MONGODB_URI,
        modelsDir: 'models',
        devtools: true
    },

    i18n: {
        strategy: 'no_prefix',
        defaultLocale: 'en',
        locales: Object.keys(languages).map((code) => {
            return {
                code,
                name: languages[code as CodeName].name,
                file: code + '.json'
            }
        })
    },
});