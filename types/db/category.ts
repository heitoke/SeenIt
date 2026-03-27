import { makeCode } from '.';

// * Types
import type { List } from './list';
import type { DataTitle } from './title';


export enum CategoryLogCode {
    Update = makeCode(3, 1, 1),
    Delete = makeCode(3, 1, 2)
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