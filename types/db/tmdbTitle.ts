export enum TMDBTitleLogCode { // 401 - 500
    
}


export interface TMDBTitleInSearch {
    id: number;
    adult: boolean;
    backdrop_path: string;
    poster_path: string;
    name: string;
    title: string;
    original_name: string;
    original_title: string;
    overview: string;
    media_type: 'tv' | 'movie';
    original_language: string;
    genre_ids: Array<number>;
    popularity: number;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    origin_country: Array<string>;
    release_date: string;
}

export interface TMDBSearch {
    page: number;
    results: Array<TMDBTitleInSearch>;
}


// * TMDBTitle
interface TMDBTitleGenre {
    id: number;
    name: string;
}

interface TMDBTitleProductionCompany {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
}

interface TMDBTitleProductionCountry {
    iso_3166_1: string;
    name: string;
}

interface TMDBTitleSpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
}

interface TemplateTMDBTitle<MediaType extends 0 | 1> {
    id: number;
    mediaType: MediaType;
    adult: boolean;
    backdrop_path: string;
    poster_path: string;
    genres: Array<TMDBTitleGenre>;
    homepage: string;
    origin_country: Array<string>;
    original_language: string;
    original_title?: string;
    original_name?: string;
    title?: string;
    name?: string;
    overview: string;
    popularity: number;
    production_companies: Array<TMDBTitleProductionCompany>;
    production_countries: Array<TMDBTitleProductionCountry>;
    spoken_languages: Array<TMDBTitleSpokenLanguage>;
    status: string;
    tagline: string;
    vote_average: number;
    vote_count: number;
}

interface TMDBTitleMovie extends TemplateTMDBTitle<0> {
    belongs_to_collection: null;
    budget: number;
    imdb_id: number | null;
    release_date: string;
    revenue: number;
    runtime: number;
    video: boolean;
}

interface TMDBTitleTVCreatedBy {
    id: number;
    credit_id: string;
    name: string;
    original_name: string;
    gender: number;
    profile_path: string;
}

interface TMDBTitleTVLastEpisodeToAir {
    id: number;
    show_id: number;
    name: string;
    overview: string;
    air_date: string;
    still_path: string;
    season_number: number;
    episode_number: number;
    episode_type: string;
    runtime: number;
    production_code: string;
    vote_average: number;
    vote_count: number;
}

interface TMDBTitleTVNetwork {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
}

interface TMDBTitleTVSeason {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    air_date: string;
    season_number: number;
    episode_count: number;
    vote_average: number;
}

interface TMDBTitleTV extends TemplateTMDBTitle<1> {
    created_by: Array<TMDBTitleTVCreatedBy>;
    episode_run_time: Array<any>;
    first_air_date: string;
    last_air_date: string;
    in_production: boolean;
    languages: Array<string>;
    last_episode_to_air: TMDBTitleTVLastEpisodeToAir | null;
    next_episode_to_air: null;
    networks: Array<TMDBTitleTVNetwork>;
    number_of_episodes: number;
    number_of_seasons: number;
    seasons: Array<TMDBTitleTVSeason>;
    type: string;
}

export type TMDBTitleData = TMDBTitleMovie | TMDBTitleTV;


export enum TMDBTitleMediaType {
    MOVIE = 0,
    TV = 1,
}

export interface TMDBTitle {
    _id: string;
    tmdbId: number;
    mediaType: TMDBTitleMediaType;
    data: TMDBTitleData;
    updatedAt: string;
    createdAt: string;
}


export interface SeasonEdisode {
    id: number;
    show_id: number;
    name: string;
    air_date: string;
    still_path: string;
    episode_number: number;
    episode_type: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    vote_average: number;
    vote_count: number;
    crew: Array<any>;
    guest_stars: Array<any>;
}

export interface Season {
    _id: string;
    id: number;
    name: string;
    poster_path: string;
    networks: Array<TMDBTitleTVNetwork>;
    air_date: string;
    overview: string;
    season_number: number;
    vote_average: number;
    episodes: Array<SeasonEdisode>;
}