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



interface Title extends Pick<DBTitle, 'id' | 'data' | 'liked'> {
    categoryId: number;
    get category(): Category | null; 
    updatedAt: Date;
    createdAt: Date;

    like(): void;
    move(newCategoryId: number): void;
    delete(): void;
}

interface Category extends Pick<DBCategory, 'id' | 'name'> {
    listId: number;
    get list(): List | null;
    get titles(): Array<Title>;
    createdAt: Date;
}

interface List extends Pick<DBList, 'id' | 'name'> {
    get categories(): Array<Category>;
    createdAt: Date;
    editMode: {
        enabled: boolean;
        selected: Array<number>;
    }
}