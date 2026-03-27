import { makeCode } from '.';


export enum UserLogCode {
    Update = makeCode(1, 1, 1),
    Delete = makeCode(1, 1, 2)
}

export enum UserPermission {
    Admin = 1 << 31
}

export interface User {
    _id: string;
    email: string;
    username: string;
    private: boolean;
    password: string;
    permissions: number;
    updatedAt: string;
    createdAt: string;
}