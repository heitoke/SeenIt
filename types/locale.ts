export const codes = [
    'en',
    'ru',
    'ja',
    'uk',
    'zh',
    'fr',
    'es'
] as const;

export type CodeName = typeof codes[number];

export interface Language {
    name: string;
    emoji: string;
}

export const languages: Record<CodeName, Language> = {
    en: {
        name: 'English',
        emoji: '🇬🇧'
    },
    ru: {
        name: 'Русский',
        emoji: '🇷🇺'
    },
    ja: {
        name: '日本語',
        emoji: '🇯🇵'
    },
    uk: {
        name: 'Українська мова',
        emoji: '🇺🇦'
    },
    zh: {
        name: '漢語',
        emoji: '🇨🇳'
    },
    fr: {
        name: 'Français',
        emoji: '🇫🇷'
    },
    es: {
        name: 'Español',
        emoji: '🇪🇸'
    }
};