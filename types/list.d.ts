import type { TMDBTitleInSearch, TMDBTitle } from './tmdb';

export interface DBList {
    id: number;
    name: string;
    created_at: string;
}

export interface DBCategory {
    id: number;
    name: string;
    list_id: number;
    created_at: string;
}

export interface DBTitle {
    id: number;
    category_id: number;
    tmdb_title_id: number;
    title: {
        data: TMDBTitle;
        updated_at: string;
    };
    liked: boolean;
    updated_at: string;
    created_at: string;
}



interface Title extends Pick<DBTitle, 'id' | 'liked'> {
    data: TMDBTitle & { lastUpdatedAt: Date };
    categoryId: number;
    get category(): Category | null; 
    updatedAt: Date;
    createdAt: Date;

    like(): void;
    move(newCategoryId: number): void;
    delete(): void;
}


interface CategoryFilters {
    text: string;
    get titles(): Array<Title>;
}

interface Category extends Pick<DBCategory, 'id' | 'name'> {
    listId: number;
    get list(): List | null;
    get titles(): Array<Title>;
    createdAt: Date;

    filters: CategoryFilters;
}


interface ListEdit {
    private _enabled: boolean;
    get enabled(): boolean;
    selected: Set<number>;
    toggle(): boolean;
}

interface List extends Pick<DBList, 'id' | 'name'> {
    get categories(): Array<Category>;
    createdAt: Date;
    edit: ListEdit;
}