export interface DBList {
    id: number;
    name: string;
    created_at: number;
}

export interface DBCategory {
    id: number;
    name: string;
    listId: number;
    createdAt: number;
}

export interface DBTitleOptions {
    liked: boolean;
}

export interface DBTitle<TypeData = string, TypeOptions = string> {
    id: number;
    categoryId: number;
    titleId: number;
    data: TypeData;
    options: TypeOptions;
    updatedAt: number;
    createdAt: number;
}