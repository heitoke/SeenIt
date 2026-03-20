// * Types
import type { User } from './user';
import type { DataCategory } from './category';


export enum ListLogName { // 101 - 200
    Update = 101,
    Delete = 102
}

export interface List<UserType = string | User> {
    _id: string;
    user: UserType;
    name: string;
    private: boolean;
    updatedAt: string;
    createdAt: string;
}

export interface DataList extends List {
    categories: Array<DataCategory>;
}