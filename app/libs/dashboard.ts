// * Types
import type {
    // DBList, DBCategory, DBTitle,
    List//, Category, Title
} from '~~/types/db/list';
import type { Category } from '~~/types/db/category';
import type { Title } from '~~/types/db/title';
import type { TMDBTitleInSearch, TMDBTitleData } from '~~/types/db/tmdbTitle';
import type { User } from '~~/types/db/user';

export interface DashboardCategoryFilters {
    text: string;
    options: Record<string, any>;
}


export class DashboardTitle {
    private data: Title;
    private _seasons: Record<string, Record<string, { status: number }>> = {};

    constructor(private dashboard: Dashboard, data: Title, parentCategoryId: string) {
        this.data = {
            ...data,
            category: parentCategoryId
        };
    }

    get _id(): string {
        return this.data._id;
    }

    get private(): boolean {
        return this.data.private;
    }

    get liked(): number {
        return this.data.liked;
    }

    get rating(): number {
        return this.data.rating;
    }

    get tmdb(): TMDBTitleData {
        // @ts-ignore
        return this.data.data;
    }

    get updatedAt(): Date {
        return new Date(this.data.updatedAt);
    }

    get createdAt(): Date {
        return new Date(this.data.createdAt);
    }


    get parentCategory(): DashboardCategory | null {
        return this.dashboard.categories.get(String(this.data.category));
    }

    get seasons() {
        return this._seasons;
    }

    
    public toObject() {
        return { ...this.data };
    }

    public updateData(newData: Partial<Pick<Title, 'liked' | 'rating' | 'private' | 'category'>>) {
        this.data = {
            ...this.data,
            ...newData
        }
    }


    public async like(liked: number) {
        return this.dashboard.titles.like(liked, this._id);
    }

    public async rated(rated: number) {
        return this.dashboard.titles.rated(rated, this._id);
    }

    public async move(newCategoryId: string) {
        return this.dashboard.titles.move(newCategoryId, this._id);
    }
    
    public async privateMode(privateMode: boolean) {
        return this.dashboard.titles.privateMode(privateMode, this._id);
    }


    public async getStatusEpisodes() {
        const data = await $fetch(`/api/titles/${this._id}/status`, {
            method: 'GET'
        });

        if (data?.length < 1) return false;
        
        for (const { props } of data) {
            const { season, episode, status } = props as Record<'season' | 'episode' | 'status', number>;

            if (!this._seasons[season]) this._seasons[season] = {};
        
            this._seasons[season][episode] = { status };
        }

        return true;
    }

    public async setEpisodeStatus(seasonNumber: number, episodeNumber: number, status: number) {
        if (status === undefined || status < 0 || status > 5) return false;

        const data = await $fetch<{ success: boolean }>(`/api/titles/${this._id}/seasons/${seasonNumber}/${episodeNumber}`, {
            body: {
                status,
            },
            method: 'POST'
        });

        if (!data?.success) return false;

        if (!this._seasons[seasonNumber]) this._seasons[seasonNumber] = {};
        
        this._seasons[seasonNumber][episodeNumber] = { status };

        return true;
    }


    public async delete() {
        return this.dashboard.titles.delete(this._id);
    }
}

export class DashboardTitles extends Array<DashboardTitle> {
    constructor(private dashboard: Dashboard) {
        super();
    }


    public has(titleId: string) {
        return this.findIndex(title => title._id === titleId) >= 0;
    }

    public get(titleId: string) {
        return this.find(title => title._id === titleId) || null;
    }


    public hasByTMDBId(tmdbId: number, mediaType: number) {
        return this.findIndex(title => title.tmdb?.id === tmdbId && title.tmdb.mediaType === mediaType) >= 0;
    }

    public getByTMDBId(tmdbId: number) {
        return this.find(title => title.tmdb?.id === tmdbId);
    }

    public getTitleIdByTMDBId(tmdbId: number, mediaType: number) {
        return this.find(title => title.tmdb?.id === tmdbId && title.tmdb.mediaType === mediaType)?._id;
    }


    public async like(liked: number, ...titleIds: Array<string>) {
        if (liked === undefined || liked < 0 || liked > 5 || titleIds?.length < 1) return false;

        const data = await $fetch<{ success: boolean, likedTitles?: Array<string> }>(`/api/titles`, {
            body: {
                action: 'like',
                ids: titleIds,
                value: liked
            },
            method: 'PUT'
        });

        if (!data?.success) return false;

        for (const title of this) {
            if (!data.likedTitles?.includes(title._id)) continue;

            title.updateData({ liked });
        }

        return true;
    }

    public async rated(rated: number, ...titleIds: Array<string>) {
        if (rated === undefined || rated < 0 || rated > 10 || titleIds?.length < 1) return false;

        const data = await $fetch<{ success: boolean, ratedTitles?: Array<string> }>(`/api/titles`, {
            body: {
                action: 'rating',
                ids: titleIds,
                value: rated
            },
            method: 'PUT'
        });

        if (!data?.success) return false;

        for (const title of this) {
            if (!data.ratedTitles?.includes(title._id)) continue;

            title.updateData({ rating: rated });
        }

        return true;
    }

    public async move(newCategoryId: string, ...titleIds: Array<string>) {
        if (!newCategoryId || titleIds?.length < 1) return false;

        const data = await $fetch<{ success: boolean, movedTitles?: Array<string> }>(`/api/titles`, {
            body: {
                action: 'move',
                ids: titleIds,
                value: newCategoryId
            },
            method: 'PUT'
        });

        if (!data?.success) return false;

        for (const title of this) {
            if (!data.movedTitles?.includes(title._id)) continue;

            title.updateData({ category: newCategoryId });
        }

        return true;
    }
    
    public async privateMode(privateMode: boolean, ...titleIds: Array<string>) {
        if (privateMode === undefined || titleIds?.length < 1) return false;

        const data = await $fetch<{ success: boolean, privatedTitles?: Array<string> }>(`/api/titles`, {
            body: {
                action: 'private',
                ids: titleIds,
                value: privateMode
            },
            method: 'PUT'
        });

        if (!data?.success) return false;

        for (const title of this) {
            if (!data.privatedTitles?.includes(title._id)) continue;

            title.updateData({ private: privateMode });
        }

        return true;
    }


    public async delete(...titleIds: Array<string>) {
        if (!titleIds.length) return null;

        const data = await $fetch(`/api/titles`, {
            body: {
                ids: titleIds
            },
            method: 'DELETE'
        });

        if (!data?.success) return false;

        for (let i = this.length - 1; i >= 0; i--) {
            if (!data.deletedTitles.includes(String(this[i]?._id))) continue

            this.splice(i, 1);
        }

        return true;
    }
}

export class DashboardCategory {
    private data: Category;

    private _filters: DashboardCategoryFilters = {
        text: '',
        options: {}
    }

    private _edit = {
        enabled: false,
        selected: new Set<string>()
    }

    constructor(private dashboard: Dashboard, data: Category, parentListId: string) {
        this.data = {
            ...data,
            list: parentListId
        };
    }

    get _id(): string {
        return this.data._id;
    }

    get name(): string {
        return this.data.name;
    }

    get private(): boolean {
        return this.data.private;
    }

    get updatedAt(): Date {
        return new Date(this.data.updatedAt);
    }

    get createdAt(): Date {
        return new Date(this.data.createdAt);
    }


    get parentList(): DashboardList | null {
        return this.dashboard.lists.get(String(this.data.list));
    }


    get titles() {
        return this.dashboard.titles.filter(title => title.parentCategory?._id === this._id);
    }

    get likedTitles() {
        return this.titles.filter(title => title.liked !== 0);
    }


    get filters() {
        return this._filters;
    }

    get filterTitles() {
        const { text, options } = this.filters;

        const regex = new RegExp(text, 'ig');

        return this.titles.filter(title => {
            return regex.test(String(title.tmdb?.name || title.tmdb?.title)) || regex.test(String(title.tmdb?.original_name || title.tmdb?.original_title));
        });
    }


    get edit() {
        return {
            enabled: this._edit.enabled,
            selected: this._edit.selected
        }
    }

    
    public toObject() {
        return { ...this.data };
    }

    public toggleEditMode() {
        this._edit.enabled = !this._edit.enabled;
    }


    public async add(...listTitles: Array<TMDBTitleInSearch>) {
        if (!listTitles.length) return;

        const titles = await $fetch<Array<Title>>(`/api/titles`, {
            body: {
                categoryId: this._id,
                titles: listTitles.map(({ id, media_type }) => ({ id, mediaType: media_type })),
                language: 'ru-RU'
            },
            method: 'POST'
        });

        for (const title of titles) {
            if (!title?._id) continue;

            this.dashboard.titles.push(new DashboardTitle(this.dashboard, title, this._id));
        }

        return true;
    }


    public async update(newCategory: Partial<Pick<Category, 'name' | 'private' | 'type'>>) {
        const data = await $fetch<Category>(`/api/categories/${this._id}`, {
            body: {
                name: newCategory.name,
                private: newCategory.private,
                type: newCategory.type
            },
            method: 'PATCH'
        });

        if (!data) return null;

        this.data = data;

        return this;
    }

    public async delete() {
        return this.dashboard.categories.delete(this._id);
    }
}

export class DashboardCategories extends Array<DashboardCategory> {
    private selectedCategory: string | null = null;

    constructor(private dashboard: Dashboard) {
        super();
    }


    get category() {
        if (!this.selectedCategory) return null;
        
        return this.get(this.selectedCategory);
    }


    public has(categoryId: string) {
        return this.findIndex(category => category._id === categoryId) >= 0;
    }

    public get(categoryId: string) {
        return this.find(category => category._id === categoryId) || null;
    }

    public async create(listId: string, body: Partial<Pick<Category, 'name' | 'private'>>) {
        const { name, private: privateMode = false } = body;

        if (!name || name.length < 1 || name.trim() === '') return;

        const newCategory = await $fetch<Category>('/api/categories', {
            body: {
                listId,
                name,
                private: privateMode
            },
            method: 'POST'
        });

        if (!newCategory?._id) return null;

        const dashboardCategory = new DashboardCategory(this.dashboard, newCategory, listId);

        this.push(dashboardCategory);

        return dashboardCategory;
    }

    public async delete(...categoryIds: Array<string>) {
        if (!categoryIds.length) return null;

        const data = await $fetch(`/api/categories`, {
            body: {
                ids: categoryIds
            },
            method: 'DELETE'
        });

        if (!data?.success) return false;

        for (let i = this.length - 1; i >= 0; i--) {
            if (!data.deletedCategories.includes(String(this[i]?._id))) continue;

            this.splice(i, 1);
        }

        for (let i = this.dashboard.titles.length - 1; i >= 0; i--) {
            if (!data.deletedCategories.includes(String(this.dashboard.titles[i]?._id))) continue;

            this.dashboard.titles.splice(i, 1);
        }

        return true;
    }
}

export class DashboardList {
    private data: List;

    private selectedCategory: string | null = null;

    constructor(private dashboard: Dashboard, data: List) {
        this.data = { ...data };
    }

    get _id(): string {
        return this.data._id;
    }

    get name(): string {
        return this.data.name;
    }

    get private(): boolean {
        return this.data.private;
    }

    get updatedAt(): Date {
        return new Date(this.data.updatedAt);
    }

    get createdAt(): Date {
        return new Date(this.data.createdAt);
    }


    get parentDashboard() {
        return this.dashboard;
    }


    get categories() {
        return this.dashboard.categories.filter(category => category.parentList?._id === this._id);
    }


    get category() {
        if (!this.selectedCategory) return null;

        return this.dashboard.categories.get(this.selectedCategory);
    }


    get likedTitles() {
        const list: Array<DashboardTitle> = [];

        for (const category of this.categories) {
            list.push(...category.likedTitles);
        }
        
        return list;
    }

    
    public select(categoryId: string | null) {
        if (categoryId === null) {
            this.selectedCategory = null;

            return true;
        }

        const categoryIndex = this.categories.findIndex(category => category._id === categoryId);

        if (categoryIndex < 0) return false;

        this.selectedCategory = categoryId;

        return true;
    }

    
    public toObject(): List {
        return { ...this.data };
    }


    public async update(newList: Partial<Pick<List, 'name' | 'private'>>) {
        const data = await $fetch<List>(`/api/lists/${this._id}`, {
            body: {
                name: newList.name,
                private: newList.private
            },
            method: 'PATCH'
        });

        if (!data) return null;

        this.data = data;

        return this;
    }

    public async delete() {
        return this.dashboard.lists.delete(this._id);
    }
}

export class DashboardLists extends Array<DashboardList> {
    constructor(private dashboard: Dashboard) {
        super();
    }


    public has(listId: string) {
        return this.findIndex(list => list._id === listId) >= 0;
    }

    public get(listId: string) {
        return this.find(list => list._id === listId) || null;
    }

    public async create(body: Partial<Pick<List, 'name' | 'private'>>) {
        const { name, private: privateMode = false } = body;

        if (!name || name.length < 1 || name.trim() === '') return;

        const newList = await $fetch<List>('/api/lists', {
            body: {
                name,
                private: privateMode
            },
            method: 'POST'
        });

        if (!newList?._id) return null;

        const dashboardList = new DashboardList(this.dashboard, newList);

        this.push(dashboardList);

        return dashboardList;
    }

    public async delete(...listIds: Array<string>) {
        if (!listIds.length) return null;

        const data = await $fetch<{ success: boolean }>(`/api/lists`, {
            body: {
                ids: listIds
            },
            method: 'DELETE'
        });

        if (!data?.success) return false;

        for (const listId of listIds) {
            const listIndex = this.findIndex(list => list._id === listId);

            if (listIndex < 0) continue;

            this.splice(listIndex, 1);
        }

        return true;
    }
}

export class Dashboard {
    private user: User = {} as User;

    readonly lists: DashboardLists;
    readonly categories: DashboardCategories;
    readonly titles: DashboardTitles;

    public alreadyFetchUse: boolean = false;
    public alreadyFetchUserData: boolean = false;

    private selectedList: string | null = null;

    constructor(readonly userId: string) {
        this.lists = new DashboardLists(this);
        this.categories = new DashboardCategories(this);
        this.titles = new DashboardTitles(this);
    }

    get _id(): string {
        return this.user._id;
    }

    get username(): string {
        return this.user.username;
    }

    get email(): string {
        return this.user.email;
    }

    get updatedAt(): Date {
        return new Date(this.user.updatedAt);
    }

    get createdAt(): Date {
        return new Date(this.user.createdAt);
    }


    get canEdit(): boolean {
        const { user } = useUserAuth();

        return String(this?._id) === String(user?.value?._id);
    }


    get list() {
        if (!this.selectedList) return null;

        return this.lists.get(this.selectedList);
    }


    get likedTitles() {
        const list: Array<DashboardTitle> = [];

        for (const category of this.categories) {
            list.push(...category.likedTitles);
        }
        
        return list;
    }

    
    public select(listId: string) {
        if (listId === null) {
            this.selectedList = null;
            
            return true;
        }

        if (!this.lists.has(listId)) return false;

        this.selectedList = listId;

        return true;
    }


    async fetchUser() {
        const { user } = useUserAuth();
        
        if (user.value && user.value?._id === this.userId) {
            this.user = { ...user.value as any as User };
        } else {
            const user = await $fetch<User>(`/api/users/${this.userId}`);

            if (!user?._id) return false;

            this.user = user;
        }

        this.alreadyFetchUse = true;

        await this.fetchUserData();

        return true;
    }

    private async fetchUserData() {
        this.lists.length = 0;
        this.categories.length = 0;
        this.titles.length = 0;

        const data = await $fetch<Array<List & { categories: Array<Category & { titles: Array<Title> }> }>>(`/api/users/${this.userId}/data`);

        if (!data?.length) return false;

        for (const list of data) {
            this.lists.push(new DashboardList(this, list));

            if (list?.categories?.length > 0) for (const category of list?.categories) {
                this.categories.push(new DashboardCategory(this, category, list._id));

                if (category?.titles?.length > 0) for (const title of category?.titles) {
                    this.titles.push(new DashboardTitle(this, title, category._id));
                }
            }
        }

        this.alreadyFetchUserData = true;

        return true;
    }
}