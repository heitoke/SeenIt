export interface TMDBTitleInSearch {
    adult: boolean;
    backdrop_path: string;
    id: number;
    name: string;
    title: string;
    original_name: string;
    original_title: string;
    overview: string;
    poster_path: string;
    media_type: 'tv' | 'movie';
    original_language: string;
    genre_ids: Array<number>;
    popularity: number;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    origin_country: Array<string>;
}

export interface TMDBSearch {
    page: number;
    results: Array<TMDBTitleInSearch>;
}

export interface TMDBTitle {
    id: number;
    adult: boolean;
    title: string;
    name: string;
    video: boolean;
    budget: number;
    genres: Array<{
        id: number;
        name: string;
    }>;
    status: string;
    imdb_id: string;
    revenue: number;
    runtime: number;
    tagline: string;
    homepage: string;
    overview: string;
    popularity: number;
    vote_count: number;
    poster_path: string;
    release_date: string;
    vote_average: number;
    backdrop_path: string;
    origin_country: Array<string>;
    original_title: string;
    original_name: string;
    spoken_languages: Array<{
        name: string;
        iso_639_1: string;
        english_name: string;
    }>;
    original_language: string;
    production_companies: Array<{
        id: number;
        name: string;
        logo_path: string;
        origin_country: string;
    }>;
    production_countries: Array<{
        name: string;
        iso_3166_1: string;
    }>;
    belongs_to_collection: {
        id: number;
        name: string;
        poster_path: string;
        backdrop_path: string;
    }
}