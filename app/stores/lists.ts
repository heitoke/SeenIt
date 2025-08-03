// * Types
import type {
    DBList, DBCategory, DBTitle,
    List, Category, Title
} from '~~/types/list';
import type { TMDBTitleInSearch } from '~~/types/tmdb';


class CacheList {
    readonly userId: string;

    readonly lists = reactive<Array<List>>([]);
    readonly categories = reactive<Array<Category>>([]);
    readonly titles = reactive<Array<Title>>([]);

    private _selectedListAndCategory = reactive<[number, number]>([-1, -1]);

    constructor(userId: string) {
        this.userId = userId;
    }


    get list(): List | null {
        return this.lists.find(l => l.id === this._selectedListAndCategory[0]) || null;
    }

    get category(): Category | null {
        return this.categories.find(l => l.id === this._selectedListAndCategory[1]) || null;
    }


    select(type: 'list' | 'category', id: number) {
        this._selectedListAndCategory[type === 'list' ? 0 : 1] = id;

        // if (type === 'category' && id > 0) {
        //     this.getTitleByCategoryId(id);
        // }
    }


    has(type: 'list' | 'category' | 'title', id: number): boolean {
        return this[type === 'list' ? 'lists' : (type === 'category' ? 'categories' : 'titles')].findIndex(t => t.id === id) >= 0;
    }

    get(type: 'list', listId: number): List | null;
    get(type: 'category', categroyId: number): Category | null;
    get(type: 'title', titleId: number): Title | null;
    get(type: 'list' | 'category' | 'title', id: number): List | Category | Title | null {
        switch (type) {
            case 'list':
                return this.lists.find(l => l.id === id) || null;
            case 'category':
                return this.categories.find(c => c.id === id) || null;
            case 'title':
                return this.titles.find(t => t.id === id) || null;
            default:
                return null;
        }
    }

    async delete(type: 'list' | 'category' | 'title', ...ids: Array<number>) {
        if (!ids.length) return null;

        const name = type === 'list' ? 'lists' : (type === 'category' ? 'categories' : 'titles');

        const data = await $fetch<{ success: boolean }>(`/api/${name}`, {
            body: {
                ids
            },
            method: 'DELETE'
        });

        if (!data?.success) return;

        const filterArray: Array<any> = this[name].filter(t => !ids.includes(t.id));

        this[name].length = 0;
        this[name].push(...filterArray);
    }


    convertList(dbList: DBList): List {
        const _this = this;
        return {
            id: dbList.id,
            name: dbList.name,
            get categories() {
                return _this.categories.filter(c => c.listId === dbList.id);
            },
            createdAt: new Date(dbList.created_at),
            edit: {
                _enabled: false,
                get enabled() {
                    return this._enabled;
                },
                selected: new Set<number>(),
                toggle() {
                    return _this.toggleEditMode(dbList.id);
                }
            },
            update(newList: Pick<List, 'name'>) {
                return _this.updateList(this.id, newList);
            },
            delete() {
                return _this.deleteList(this.id);
            }
        }
    }

    convertCategory(dbCategory: DBCategory): Category {
        const _this = this;

        const data: Category = {
            id: dbCategory.id,
            name: dbCategory.name,
            listId: dbCategory.list_id,
            get list() {
                return _this.lists.find(l => l.id === this.listId) || null;
            },
            get titles() {
                return _this.titles.filter(t => t.categoryId === dbCategory.id);
            },
            createdAt: new Date(dbCategory.created_at),

            filters: {
                text: '',
                get titles() {
                    const regex = new RegExp(this.text, 'ig');

                    return data.titles.filter(t => regex.test(t.data.name) || regex.test(t.data.title) || regex.test(t.data.original_name) || regex.test(t.data.original_title));
                }
            }
        }

        return data;
    }

    convertTitle(dbTitle: DBTitle): Title {
        const _this = this;
        return {
            id: dbTitle.id,
            data: {
                ...dbTitle.title.data,
                mediaType: dbTitle.title.media_type,
                lastUpdatedAt: new Date(dbTitle.title.updated_at)
            },
            liked: dbTitle.liked,
            categoryId: dbTitle.category_id,
            get category() {
                return _this.categories.find(c => c.id === this.categoryId) || null;
            },
            updatedAt: new Date(dbTitle.updated_at),
            createdAt: new Date(dbTitle.created_at),

            like() {
                _this.likeTitles([this.id], !this.liked);
            },
            move(newCategoryId) {
                _this.moveTitles([this.id], newCategoryId);
            },
            delete() {
                _this.delete('title', this.id);
            }
        }
    }   


    async loadUserData() {
        const _this = this;

        this.lists.length = 0;
        this.categories.length = 0;
        this.titles.length = 0;

        const likedCategory = this.convertCategory({
            id: 0,
            list_id: 0,
            name: 'Liked',
            created_at: new Date().toISOString()
        });

        this.categories.push({
            ...likedCategory,
            get titles() {
                return _this.titles.filter(t => t.category?.listId === _this.list?.id && t.liked === true);
            },
            get list() {
                return null;
            }
        });

        const data = await $fetch<{
            lists: Array<DBList>,
            categories: Array<DBCategory>,
            titles: Array<DBTitle>
        }>(`/api/users/${this.userId}/data`);

        for (const dbList of data.lists) {
            this.lists.push(this.convertList(dbList));
        }

        for (const dbCategory of data.categories) {
            this.categories.push(this.convertCategory(dbCategory));
        }

        for (const dbTitle of data.titles) {
            this.titles.push(this.convertTitle(dbTitle));
        }
    }


    async getTitleByCategoryId(categoryId: number) {
        const category = this.categories.find(c => c.id === categoryId);
        
        if (!category) return [];

        const dataTitles = await $fetch<Array<DBTitle>>(`/api/lists/${category.listId}/categories/${category.id}/titles`);

        if (dataTitles.length < 1) return null;

        for (const dbTitle of dataTitles) {
            const titleIndex = this.titles.findIndex(t => t.id === dbTitle.id);

            const dataTitle = this.convertTitle(dbTitle);

            if (titleIndex < 0) this.titles.push(dataTitle);
            else this.titles[titleIndex] = dataTitle;
        }
    }

    async createList(name: string) {
        if (!name) return;

        const dbList = await $fetch<DBList>('/api/lists', {
            body: {
                name
            },
            method: 'POST'
        });

        if (!dbList?.id) return;

        const list = this.convertList(dbList);
        
        this.lists.push(list);

        return list;
    }

    async createCategory(listId: number, name: string) {
        if (this.lists.findIndex(l => l.id === listId) < 0 || !name) return null;

        const dbCategory = await $fetch<DBCategory>(`/api/lists/${listId}/categories`, {
            body: {
                name
            },
            method: 'POST'
        });

        if (!dbCategory?.id) return;

        const category = this.convertCategory(dbCategory);
        
        this.categories.push(category);

        return category;
    }

    async addTitles(listTitles: Array<TMDBTitleInSearch>, categoryId: number) {
        if (!listTitles.length || !categoryId) return;

        const category = this.categories.find(c => c.id === categoryId);

        if (!category) return false;

        const data = await $fetch<Array<DBTitle>>(`/api/titles`, {
            body: {
                categoryId,
                titles: listTitles.map(({ id, media_type }) => ({ id, mediaType: media_type })),
                language: 'ru-RU'
            },
            method: 'POST'
        });

        for (const dbTitle of data) {
            if (!dbTitle?.id) continue;

            this.titles.push(this.convertTitle(dbTitle));
        }

        return true;
    }

    async moveTitles(ids: Array<Number>, newCategoryId: number) {
        if (!ids.length || !newCategoryId) return null;

        const data = await $fetch(`/api/titles`, {
            body: {
                action: 'move',
                ids,
                categoryId: newCategoryId
            },
            method: 'PUT'
        });

        if (!data?.success) return;

        for (const title of this.titles) {
            if (!ids.includes(title.id)) continue;

            title.categoryId = newCategoryId;
        }
    }

    async likeTitles(ids: Array<Number>, liked: boolean = true) {
        if (!ids.length) return null;

        const data = await $fetch(`/api/titles`, {
            body: {
                action: liked ? 'like' : 'unlike',
                ids
            },
            method: 'PUT'
        });

        if (!data?.success) return;

        for (const title of this.titles) {
            if (!ids.includes(title.id)) continue;

            title.liked = liked;
        }
    }


    async updateList(listId: number, newList: Pick<List, 'name'>) {
        const list = this.get('list', listId);

        if (!list) return false;

        const data = await $fetch<{ name: string }>(`/api/lists/${list.id}`, {
            body: {
                name: newList.name
            },
            method: 'PATCH'
        });

        if (!data) return false;

        list.name = data.name;

        return true;
    }


    async deleteList(listId: number) {
        const list = this.get('list', listId);

        if (!list) return false;

        const data = await $fetch<{ name: string }>(`/api/lists/${list.id}`, {
            method: 'DELETE'
        });

        if (!data) return false;

        const titles = this.titles.filter(t => t.category?.list?.id !== listId);
        this.titles.length = 0;
        this.titles.push(...titles);

        const categories = this.categories.filter(c => c.listId !== listId);
        this.categories.length = 0;
        this.categories.push(...categories);

        const lists = this.lists.filter(l => l.id !== listId);
        this.lists.length = 0;
        this.lists.push(...lists);

        return true;
    }


    // * Edit Mode
    toggleEditMode(listId: number): boolean {
        if (!this.has('list', listId)) return false;

        const list = this.get('list', listId)!;

        list.edit._enabled = !list.edit._enabled;

        return list.edit.enabled;
    }
}


export const useListsStore = defineStore('lists', () => {
    const cacheLists = new Map<string, CacheList>();

    return {
        has(id: string) {
            return cacheLists.has(id);
        },
        get(id: string): CacheList {
            if (cacheLists.has(id)) return cacheLists.get(id)!;

            const newCacheList = new CacheList(id);

            cacheLists.set(id, newCacheList);

            return newCacheList;
        },
        remove(id: string) {
            if (!cacheLists.has(id)) return true;

            cacheLists.delete(id);

            return true;
        }
    }
});