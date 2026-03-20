// * Types
import type { List } from './list';
import type { DataTitle } from './title';


export enum CategoryLogName { // 201 - 300
    Update = 201,
    Delete = 202
}

export interface Category<ListType = string | List> {
    _id: string;
    list: ListType;
    name: string;
    private: boolean;
    updatedAt: string;
    createdAt: string;
}

export interface DataCategory extends Omit<Category, 'list'> {
    titles: Array<DataTitle>;
}