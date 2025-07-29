import tailwindcss from '@tailwindcss/vite';


export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	css: ['~/assets/styles/tailwind.css'],
	vite: {
		plugins: [
			tailwindcss()
		],
	},
	modules: ['shadcn-nuxt', '@pinia/nuxt', '@nuxtjs/supabase'],
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
	devtools: { enabled: true },
});