import type { TMDBTitleInSearch, TMDBTitle } from './tmdb';

export interface DBList {
    id: number;
    private: boolean;
    name: string;
    created_at: string;
}

export interface DBCategory {
    id: number;
    private: boolean;
    name: string;
    list_id: number;
    created_at: string;
}

export interface DBTitle {
    id: number;
    private: boolean;
    category_id: number;
    tmdb_title_id: number;
    title: {
        data: TMDBTitle;
        media_type: 'movie' | 'tv';
        updated_at: string;
    };
    liked: number;
    rating: number;
    updated_at: string;
    created_at: string;
}



interface Title extends Pick<DBTitle, 'id' | 'liked' | 'private' | 'rating'> {
    data: TMDBTitle & { mediaType: 'movie' | 'tv', lastUpdatedAt: Date };
    categoryId: number;
    get category(): Category | null; 
    updatedAt: Date;
    createdAt: Date;

    like(num: number): void;
    setPrivate(bool: boolean): void;
    move(newCategoryId: number): void;
    delete(): void;
}


interface CategoryFilters {
    text: string;
    options: Record<string, any>;
    get titles(): Array<Title>;
}

interface Category extends Pick<DBCategory, 'id' | 'name' | 'private'> {
    listId: number;
    get list(): List | null;
    get titles(): Array<Title>;
    createdAt: Date;

    filters: CategoryFilters;
    update(newList: Pick<Category, 'name' | 'private'>): Promise<boolean>;
    delete(): Promise<boolean>;
}


interface ListEdit {
    private _enabled: boolean;
    get enabled(): boolean;
    selected: Set<number>;
    toggle(): boolean;
}

interface List extends Pick<DBList, 'id' | 'name' | 'private'> {
    get categories(): Array<Category>;
    createdAt: Date;
    edit: ListEdit;

    update(newList: Pick<List, 'name' | 'private'>): Promise<boolean>;
    delete(): Promise<boolean>;
}