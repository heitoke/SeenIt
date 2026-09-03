import { languages, type CodeName } from './types/locale';


export default defineNuxtConfig({
    devtools: { enabled: true },

    routeRules: {
        '/one-tab': {
            headers: {
                'X-Frame-Options': '',
                'Content-Security-Policy': 'frame-ancestors *'
            }
        }
    },

    css: ['~/assets/styles/root.scss'],

    modules: [
      '@heito/hxui/nuxt',
      '@pinia/nuxt',
      '@nuxtjs/i18n',
      'nuxt-mongoose',
      './server/modules/auth.module',
      '@vite-pwa/nuxt',
    ],

    runtimeConfig: {
        secret: process.env.SECRET || 'seen-it-secret',
        tmdbApiUrl: process.env.TMDB_API_URL || 'https://api.themoviedb.org',
        tmdbApiKey: process.env.TMDB_API_KEY || '',
        
        public: {
            tmdbImageUrl: process.env.TMDB_IMAGE_URL || 'https://image.tmdb.org'
        }
    },

    pinia: {
        storesDirs: ['./stores/**']
    },

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

    pwa: {
        strategies: 'generateSW',
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
            name: 'SeenIt',
            short_name: 'SeenIt',
            theme_color: '#000000',
            background_color: '#000000',
            description: 'SeenIt',
            start_url: '/app',
            display: 'standalone',
            icons: [
                {
                    src: 'seen-it-dark-256x256.png',
                    sizes: '256x256',
                    type: 'image/png'
                },
                {
                    src: 'seen-it-dark-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                },
                {
                    src: 'seen-it-dark-512x512.png', 
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable' 
                }
            ]
        },
        devOptions: {
            enabled: true,
            type: 'module'
        }
    }
});