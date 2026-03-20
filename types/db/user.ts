export enum UserLogName { // 0 - 100
    Update = 0
}

export interface User {
    _id: string;
    email: string;
    username: string;
    private: boolean;
    password: string;
    updatedAt: string;
    createdAt: string;
}