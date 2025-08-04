import tailwindcss from '@tailwindcss/vite';


import { languages, type CodeName } from './types/locale';


export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    css: ['~/assets/styles/tailwind.css'],
    vite: {
        plugins: [
            tailwindcss()
        ],
    },
    modules: [
        'shadcn-nuxt',
        '@pinia/nuxt',
        '@nuxtjs/supabase',
        '@nuxtjs/i18n',
        '@vite-pwa/nuxt',
    ],
    runtimeConfig: {
        githubClientId: '',
        githubClientSecret: '',
        tmdbApiKey: ''
    },
    pinia: {
        storesDirs: ['./stores/**']
    },
    components: [
        {
            path: '~/components/ui',
            pathPrefix: false,
            prefix: ''
        }
    ],
    shadcn: {
        prefix: '',
        componentDir: './app/components/ui'
    },
    supabase: {
        redirect: false
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
    devtools: { enabled: true },
    pwa: {
        strategies: 'generateSW',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
            name: 'SeenIt',
            short_name: 'SeenIt',
            theme_color: '#000000',
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
                }
            ]
        }
    }
});