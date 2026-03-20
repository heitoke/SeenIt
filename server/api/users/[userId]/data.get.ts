import { createError } from 'h3';
import mongoose from 'mongoose';

// * Types
import type { DataList } from '~~/types/db/list';
import type { DataCategory } from '~~/types/db/category';
import type { DataTitle } from '~~/types/db/title';


export default defineEventHandler(async (event) => {
    const $user = await $userAuth.getUser(event);

    const userId = getRouterParam(event, 'userId');

    const isAuthUser = $user && String($user._id) === String(userId);

    const lists = await ListSchema
        .find(Object.assign({ user: String(userId) }, isAuthUser ? {} : { private: false }))
        .select(['-user', '-__v'])
        .lean<Array<DataList>>();

    const categories = await CategorySchema
        .find(Object.assign({
            list: lists.map(list => list._id)
        }, isAuthUser ? {} : { private: false }))
        .select(['-__v'])
        .lean<Array<DataCategory>>();

    const titles = await TitleSchema
        .find(Object.assign({
            category: categories.map(category => category._id)
        }, isAuthUser ? {} : { private: false }))
        .populate('tmdbTitle')
        .select(['-__v', '-history'])
        .lean<Array<DataTitle>>();

    for (const { category: categoryId, tmdbTitle, ...title } of titles) {
        const categoryIndex = categories.findIndex(category => String(category._id) === String(categoryId));

        if (categoryIndex < 0 || !categories[categoryIndex]) continue;

        title['data'] = {
            ...tmdbTitle.data,
            mediaType: tmdbTitle.mediaType
        };

        if (!categories[categoryIndex]['titles']) categories[categoryIndex]['titles'] = [];

        categories[categoryIndex]['titles'].push(title);
    }

    for (const { list: listId, ...category } of categories) {
        const listIndex = lists.findIndex(list => String(list._id) === String(listId));

        if (listIndex < 0 || !lists[listIndex]) continue;

        if (!lists[listIndex]['categories']) lists[listIndex]['categories'] = [];

        lists[listIndex]['categories'].push(category);
    }

    return lists;
});
