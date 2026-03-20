// * Types
import { type User, UserLogName } from './user';
import { ListLogName } from './list';
import { CategoryLogName } from './category';
import { TitleLogName } from './title';
import { TMDBTitleLogName } from './tmdbTitle';


export const LogName = {
    User: UserLogName,
    List: ListLogName,
    Category: CategoryLogName,
    Title: TitleLogName,
    TMDBTitle: TMDBTitleLogName
};

export type LogName = UserLogName | ListLogName | CategoryLogName | TitleLogName | TMDBTitleLogName;

export interface Log<UserType = string | User> {
    _id: string;
    user: UserType;
    name: typeof LogName;
    props: object;
    updatedAt: string;
    createdAt: string;
}