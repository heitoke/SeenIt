interface UrlAvatarOptions {
    variant: 'beam' | 'marble' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
    size: number;
    isPng: boolean;
    isSquare: boolean;
    colors: Array<string>;
}

export function getUrlAvatar(name?: string, options: Partial<UrlAvatarOptions> = {}) {
    const {
        variant = 'beam',
        size = 32,
        isPng = false,
        isSquare = false,
        colors = []
    } = options;

    return `https://avatars.heito.xyz/${variant}/${size}/${name}?square=${isSquare}${isPng ? '&png=true' : ''}`;
}

export function getImageTMDB(path?: string): string | null {
    const $config = useRuntimeConfig();

    return Boolean(path) ? `${$config.public.tmdbImageUrl}/t/p/original${path}` : null;
}

export function runtimeToHM(runtime: number) {
    return ((runtime / 60) >= 1 ? `${Math.floor(runtime / 60)}h ` : '') + `${runtime % 60}m`;
}