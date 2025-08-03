import { TMDBSearch } from "~~/types/tmdb";

export default eventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const { type = 'multi', text, adult = true, lang = 'en-US' } = getQuery(event);

    if (type !== 'multi' && type !== 'movie' && type !== 'tv') return { results: [] };

    const res = await fetch(`https://api.themoviedb.org/3/search/${type}?query=${text}&include_adult=${adult}&language=${lang}&page=1`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${config.tmdbApiKey}`
        },
        method: 'GET'
    });

    const json = await res.json();

    json.results = json.results.map((t: any) => ({ ...t, media_type: t?.media_type || type }));

    return json as TMDBSearch;
});