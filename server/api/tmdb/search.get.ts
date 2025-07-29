import { TMDBSearch } from "~~/types/tmdb";

export default eventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const { text, lang = 'en-US' } = getQuery(event);

    const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${text}&include_adult=false&language=${lang}&page=1`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${config.tmdbApiKey}`
        },
        method: 'GET'
    });

    const json = await res.json();

    return json as TMDBSearch;
});