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