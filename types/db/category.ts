import { makeCode } from '.';

// * Types
import type { List } from './list';
import type { DataTitle } from './title';


export enum CategoryLogCode {
    Update = makeCode(3, 1, 1),
    Delete = makeCode(3, 1, 2)
}


export enum CategoryType {
    None = 0,
    Watched = 1,
    Watching = 2,
    Planned = 3,
    Paused = 4,
    Dropped = 5
}

export interface Category<ListType = string | List> {
    _id: string;
    list: ListType;
    name: string;
    private: boolean;
    type: CategoryType;
    updatedAt: string;
    createdAt: string;
}

export interface DataCategory extends Omit<Category, 'list'> {
    titles: Array<DataTitle>;
}