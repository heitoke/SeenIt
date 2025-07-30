import type { TMDBTitleInSearch } from './tmdb';

export interface DBList {
    id: number;
    name: string;
    created_at: number;
}

export interface DBCategory {
    id: number;
    name: string;
    list_id: number;
    created_at: number;
}

export interface DBTitle {
    id: number;
    category_id: number;
    title_id: number;
    data: TMDBTitleInSearch;
    liked: boolean;
    updated_at: number;
    created_at: number;
}