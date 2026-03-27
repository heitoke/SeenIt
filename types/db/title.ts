import { makeCode } from '.';

// * Types
import type { Category } from './category';
import type { TMDBTitle } from './tmdbTitle';


export enum TitleLogCode { // 301 - 400
    MoveToCategory = makeCode(4, 1, 1), // 3.0.0.0
    Like = makeCode(4, 1, 2), // 3.0.1.0
    Private = makeCode(4, 1, 3), // 3.0.2.0
    Delete = makeCode(4, 1, 4)
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