// * Types
import type { Category } from './category';
import type { TMDBTitle } from './tmdbTitle';


export enum TitleLogName { // 301 - 400
    MoveToCategory = 301,
    Like = 302,
    Private = 303,
    Delete = 304
}

export interface Title<CategoryType = string | Category, TMDBTitleType = string | TMDBTitle> {
    _id: string;
    category: CategoryType;
    tmdbTitle: TMDBTitleType;
    private: boolean;
    liked: number;
    rating: number;
    updatedAt: string;
    createdAt: string;
}

export interface DataTitle extends Omit<Title, 'category'> {
    data: TMDBTitle & {
        mediaType: number;
    }
}