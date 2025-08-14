// * Types
import type {
    DBList, DBCategory, DBTitle,
    List, Category, Title
} from '~~/types/list';
import type { TMDBTitleInSearch } from '~~/types/tmdb';
import type { User } from '~~/types/user';


class CacheUser {
    readonly userId: number;
    private _user = reactive<User>({} as any);

    readonly lists = reactive<Array<List>>([]);
    readonly categories = reactive<Array<Category>>([]);
    readonly titles = reactive<Array<Title>>([]);

    private _selectedListAndCategory = reactive<[number, number]>([-1, -1]);

    alreadyLoadUser: boolean = false;
    alreadyLoadUserData: boolean = false;

    constructor(userId: number) {
        this.userId = userId;
    }


    get user(): User | null {
        return this._user || null;
    }

    get canEdit(): boolean {
        const $user = useSupabaseUser();

        return $user?.value?.app_metadata?.public_id === this.user?.id;
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
            private: dbList.private,
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
            update(newList: Pick<List, 'name' | 'private'>) {
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
            private: dbCategory.private,
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
                options: {},
                get titles() {
                    const regex = new RegExp(this.text, 'ig');

                    return data.titles.filter(t => regex.test(t.data.name) || regex.test(t.data.title) || regex.test(t.data.original_name) || regex.test(t.data.original_title));
                }
            },
            update(newCategory: Pick<Category, 'name' | 'private'>) {
                return _this.updateCategory(this.id, newCategory);
            },
            delete() {
                return _this.deleteCategory(this.id);
            }
        }

        return data;
    }

    convertTitle(dbTitle: DBTitle): Title {
        const _this = this;
        return {
            id: dbTitle.id,
            private: dbTitle.private,
            rating: dbTitle.rating,
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

            like(num: number = 1) {
                _this.likeTitles([this.id], num);
            },
            setPrivate(bool) {
                _this.privateTitles([this.id], bool);
            },
            move(newCategoryId) {
                _this.moveTitles([this.id], newCategoryId);
            },
            delete() {
                _this.delete('title', this.id);
            }
        }
    }   


    async loadUser() {
        const $user = useSupabaseUser();
        
        if ($user.value && $user.value?.app_metadata?.public_id === this.userId) {
            const { id, app_metadata, user_metadata, created_at } = $user.value;

            this._user = {
                id: app_metadata?.public_id,
                uid: id,
                user: {
                    ...user_metadata,
                    providers: app_metadata?.providers
                } as User['user'],
                created_at
            }
        } else {
            const user = await $fetch<User>(`/api/users/${this.userId}`);

            if (!user?.id) return;

            this._user = user;
        }

        this.alreadyLoadUser = true;

        await this.loadUserData();
    }

    private async loadUserData() {
        const _this = this;

        this.lists.length = 0;
        this.categories.length = 0;
        this.titles.length = 0;

        const likedCategory = this.convertCategory({
            id: 0,
            private: false,
            list_id: 0,
            name: 'Liked',
            created_at: new Date().toISOString()
        });

        this.categories.push({
            ...likedCategory,
            get titles() {
                return _this.titles.filter(t => t.category?.listId === _this.list?.id && t.liked > 0);
            },
            get list() {
                return null;
            },
            filters: {
                text: '',
                options: {},
                get titles() {
                    const regex = new RegExp(this.text, 'ig');

                    return _this.titles.filter(t => t.category?.listId === _this.list?.id && t.liked > 0 && (regex.test(t.data.name) || regex.test(t.data.title) || regex.test(t.data.original_name) || regex.test(t.data.original_title)));
                }
            },
        });

        const lists = await $fetch<Array<DBList & { categories: Array<DBCategory & { titles: Array<DBTitle> }> }>>(`/api/users/${this.userId}/data`);

        if (!lists?.length) return;

        for (const dbList of lists) {
            this.lists.push(this.convertList(dbList));

            for (const dbCategory of dbList.categories) {
                this.categories.push(this.convertCategory(dbCategory));

                for (const dbTitle of dbCategory.titles) {
                    this.titles.push(this.convertTitle(dbTitle));
                }
            }
        }

        this.alreadyLoadUserData = true;
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
                value: newCategoryId
            },
            method: 'PUT'
        });

        if (!data?.success) return;

        for (const title of this.titles) {
            if (!ids.includes(title.id)) continue;

            title.categoryId = newCategoryId;
        }
    }
    
    async privateTitles(ids: Array<Number>, privateMode: boolean = true) {
        if (!ids.length) return null;

        const data = await $fetch(`/api/titles`, {
            body: {
                action: 'private',
                ids,
                value: privateMode
            },
            method: 'PUT'
        });

        if (!data?.success) return;

        for (const title of this.titles) {
            if (!ids.includes(title.id)) continue;

            title.private = privateMode;
        }
    }

    async likeTitles(ids: Array<Number>, liked: number = 0) {
        if (!ids.length) return null;

        const data = await $fetch(`/api/titles`, {
            body: {
                action: 'like',
                ids,
                value: liked
            },
            method: 'PUT'
        });

        if (!data?.success) return;

        for (const title of this.titles) {
            if (!ids.includes(title.id)) continue;

            title.liked = liked;
        }
    }


    async updateList(listId: number, newList: Pick<List, 'name' | 'private'>) {
        const list = this.get('list', listId);

        if (!list) return false;

        const data = await $fetch<DBList>(`/api/lists/${list.id}`, {
            body: {
                name: newList.name,
                private: newList.private
            },
            method: 'PATCH'
        });

        if (!data) return false;

        list.name = data.name;
        list.private = data.private;

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


    async updateCategory(categoryId: number, newCategory: Pick<Category, 'name' | 'private'>) {
        const category = this.get('category', categoryId);

        if (!category) return false;

        const data = await $fetch<DBList>(`/api/categories/${category.id}`, {
            body: {
                name: newCategory.name,
                private: newCategory.private
            },
            method: 'PATCH'
        });

        if (!data) return false;

        category.name = data.name;
        category.private = data.private;

        return true;
    }

    async deleteCategory(categoryId: number) {
        const category = this.get('category', categoryId);

        if (!category) return false;

        const data = await $fetch<{ name: string }>(`/api/categories/${category.id}`, {
            method: 'DELETE'
        });

        if (!data) return false;

        const titles = this.titles.filter(t => t.category?.id !== categoryId);
        this.titles.length = 0;
        this.titles.push(...titles);

        const categories = this.categories.filter(c => c.id !== categoryId);
        this.categories.length = 0;
        this.categories.push(...categories);

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


export const useCacheUsersStore = defineStore('cache-users', () => {
    const CacheUsers = new Map<number, CacheUser>();

    return {
        has(id: number) {
            return CacheUsers.has(id);
        },
        get(id: number): CacheUser {
            if (CacheUsers.has(id)) return CacheUsers.get(id)!;

            const newCacheUser = new CacheUser(id);

            CacheUsers.set(id, newCacheUser);

            return newCacheUser;
        },
        remove(id: number) {
            if (!CacheUsers.has(id)) return true;

            CacheUsers.delete(id);

            return true;
        },

        getByTypeId(type: 'list' | 'category' | 'title', id: number) {
            let CacheUser: CacheUser | null = null;

            CacheUsers.forEach((cl, userId) => {
                const index = cl[type === 'list' ? 'lists' : (type === 'title' ? 'titles' : 'categories')].findIndex(t => t.id === id);

                if (index < 0) return;

                CacheUser = cl;
            });

            return CacheUser;
        },
        getTypeById(type: 'list' | 'category' | 'title', id: number) {
            let dataType: any | null = null;

            CacheUsers.forEach((cl, userId) => {
                const data = cl[type === 'list' ? 'lists' : (type === 'title' ? 'titles' : 'categories')].find(t => t.id === id);

                if (!data) return;

                dataType = data;
            });

            return dataType;
        }
    }
});