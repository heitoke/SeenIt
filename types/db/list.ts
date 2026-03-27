import { makeCode } from '.';

// * Types
import type { User } from './user';
import type { DataCategory } from './category';


export enum ListLogCode {
    Update = makeCode(2, 1, 1),
    Delete = makeCode(2, 1, 2),

    InviteMember = makeCode(2, 2, 1),
    InviteMemberAccept = makeCode(2, 1, 1, 1),
    InviteMemberReject = makeCode(2, 1, 1, 2),

    InvitedMember = makeCode(2, 2, 2),
    InvitedMemberAccept = makeCode(2, 1, 2, 1),
    InvitedMemberReject = makeCode(2, 1, 2, 2),
}

export enum MemberPermission {

}

export interface Member {
    user: string;
    host: string;
    permissions: number;
    addedAt: string;
}

export interface List<UserType = string | User> {
    _id: string;
    user: UserType;
    name: string;
    private: boolean;
    members: Array<Member>;
    updatedAt: string;
    createdAt: string;
}

export interface DataList extends List {
    categories: Array<DataCategory>;
}