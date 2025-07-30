import tailwindcss from '@tailwindcss/vite';


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
		locales: [
			{ code: 'en', name: 'English', file: 'en.json' },
			{ code: 'ru', name: 'Russian', file: 'ru.json' }
		]
	},
    devtools: { enabled: true },
});