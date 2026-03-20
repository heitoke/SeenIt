import { languages, type CodeName } from './types/locale';


export default defineNuxtConfig({
    devtools: { enabled: true },

    css: ['~/assets/styles/root.scss'],

    modules: [
        '@heito/hxui/nuxt',
        '@pinia/nuxt',
        '@nuxtjs/i18n',
        'nuxt-mongoose',
        './server/modules/auth.module'
    ],

    runtimeConfig: {
        tmdbApiUrl: process.env.TMDB_API_URL || 'https://api.themoviedb.org',
        tmdbApiKey: process.env.TMDB_API_KEY || '',
        
        public: {
            tmdbImageUrl: process.env.TMDB_IMAGE_URL || 'https://image.tmdb.org'
        }
    },

    pinia: {
        storesDirs: ['./stores/**']
    },

    // components: [
    //     {
    //         path: '~/components/ui',
    //         pathPrefix: false,
    //         prefix: 'UI'
    //     }
    // ],

    hxUI: {
        prefix: ''
    },

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