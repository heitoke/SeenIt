// * Types
import { type User, UserLogCode } from './user';
import { ListLogCode } from './list';
import { CategoryLogCode } from './category';
import { TitleLogCode } from './title';
import { TMDBTitleLogCode } from './tmdbTitle';


export const LogCode = {
    User: UserLogCode,
    List: ListLogCode,
    Category: CategoryLogCode,
    Title: TitleLogCode,
    TMDBTitle: TMDBTitleLogCode
};

export type LogCode = UserLogCode | ListLogCode | CategoryLogCode | TitleLogCode | TMDBTitleLogCode;

export interface Log<UserType = string | User> {
    _id: string;
    user: UserType;
    code: number;
    props: Record<string, any>;
    updatedAt: string;
    createdAt: string;
}