// * Types
import type {
    DBList, DBCategory, DBTitle,
    List, Category, Title
} from '~~/types/list';
import type { TMDBTitleInSearch } from '~~/types/tmdb';


export const useListsStore = defineStore('lists', () => {
    const _lists = ref<Array<List>>([]);
    const _categories = ref<Array<Category>>([]);
    const _titles = ref<Array<Title>>([]);

    const _selectedLC = ref<{ list: number, category: number }>({
        list: -1,
        category: -1
    });


    const lists = computed(() => _lists.value);
    const categories = computed(() => _categories.value);
    const titles = computed(() => _titles.value);

    const selectedList = computed(() => {
        return _lists.value.find(l => l.id === _selectedLC.value.list) || null;
    });
    const selectedCategory = computed(() => {
        return categories.value.find(c => c.id === _selectedLC.value.category) || null;
    });


    function convertList(dbList: DBList): List {
        return {
            id: dbList.id,
            name: dbList.name,
            get categories() {
                return categories.value.filter(c => c.listId === dbList.id);
            },
            createdAt: new Date(dbList.created_at),
            editMode: {
                enabled: false,
                selected: []
            }
        }
    }

    function convertCategory(dbCategory: DBCategory): Category {
        return {
            id: dbCategory.id,
            name: dbCategory.name,
            listId: dbCategory.list_id,
            get list() {
                return lists.value.find(l => l.id === this.listId) || null;
            },
            get titles() {
                return titles.value.filter(t => t.categoryId === dbCategory.id);
            },
            createdAt: new Date(dbCategory.created_at)
        }
    }

    function convertTitle(dbTitle: DBTitle): Title {
        return {
            id: dbTitle.id,
            data: dbTitle.data,
            liked: dbTitle.liked,
            categoryId: dbTitle.category_id,
            get category() {
                return categories.value.find(c => c.id === this.categoryId) || null;
            },
            updatedAt: new Date(dbTitle.updated_at),
            createdAt: new Date(dbTitle.created_at),

            like() {
                likeTitles([this.id], !this.liked);
            },
            move(newCategoryId) {
                moveTitles([this.id], newCategoryId);
            },
            delete() {
                deleteTitles([this.id]);
            }
        }
    }


    async function getMyData() {
        _lists.value = [];
        _categories.value = [{
            id: 0,
            name: 'Liked',
            listId: 0,
            get titles() {
                return titles.value.filter(t => t.category?.listId === selectedList.value?.id && t.liked === true);
            },
            get list() {
                return null;
            },
            createdAt: new Date()
        }];

        const data = await $fetch<{ lists: Array<DBList>, categories: Array<DBCategory> }>('/api/lists/my');

        for (const dbList of data.lists) {
            _lists.value.push(convertList(dbList));
        }

        for (const dbCategory of data.categories) {
            _categories.value.push(convertCategory(dbCategory));
        }
    }

    async function getTitleByCategoryId(categoryId: number) {
        const category = categories.value.find(c => c.id === categoryId);
        
        if (!category) return [];

        const dataTitles = await $fetch<Array<DBTitle>>(`/api/lists/${category.listId}/categories/${category.id}/titles`);

        if (dataTitles.length < 1) return null;

        for (const dbTitle of dataTitles) {
            const titleIndex = titles.value.findIndex(t => t.id === dbTitle.id);

            const dataTitle = convertTitle(dbTitle);

            if (titleIndex < 0) _titles.value.push(dataTitle);
            else _titles.value[titleIndex] = dataTitle;
        }
    }


    function selectLC(type: 'list' | 'category', id: number) {
        _selectedLC.value[type] = id;

        console.log(type, id, _selectedLC.value)

        if (type === 'category' && id > 0) {
            getTitleByCategoryId(id);
        }
    }


    async function createList(name: string) {
        if (!name) return;

        const dbList = await $fetch<DBList>('/api/lists', {
            body: {
                name
            },
            method: 'POST'
        });

        if (!dbList?.id) return;

        const list = convertList(dbList);
        
        _lists.value.push(list);

        return list;
    }

    async function createCategory(listId: number, name: string) {
        if (lists.value.findIndex(l => l.id === listId) < 0 || !name) return null;

        const dbCategory = await $fetch<DBCategory>(`/api/lists/${listId}/categories`, {
            body: {
                name
            },
            method: 'POST'
        });

        if (!dbCategory?.id) return;

        const category = convertCategory(dbCategory);
        
        _categories.value.push(category);

        return category;
    }

    async function addTitles(listTitles: Array<TMDBTitleInSearch>, categoryId: number) {
        if (!listTitles.length || !categoryId) return;

        const category = categories.value.find(c => c.id === categoryId);

        if (!category) return;

        const data = await $fetch<Array<DBTitle>>(`/api/lists/${category.listId}/categories/${category.id}/titles`, {
            body: {
                titles: listTitles
            },
            method: 'POST'
        });

        for (const dbTitle of data) {
            if (!dbTitle?.id) continue;

            _titles.value.push(convertTitle(dbTitle));
        }
    }


    async function moveTitles(ids: Array<Number>, newCategoryId: number) {
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

        for (const title of _titles.value) {
            if (!ids.includes(title.id)) continue;

            title.categoryId = newCategoryId;
        }
    }

    async function likeTitles(ids: Array<Number>, liked: boolean = true) {
        if (!ids.length) return null;

        const data = await $fetch(`/api/titles`, {
            body: {
                action: liked ? 'like' : 'unlike',
                ids
            },
            method: 'PUT'
        });

        if (!data?.success) return;

        for (const title of _titles.value) {
            if (!ids.includes(title.id)) continue;

            title.liked = liked;
        }
    }


    async function deleteTitles(ids: Array<Number>) {
        if (!ids.length) return null;

        const data = await $fetch(`/api/titles`, {
            body: {
                ids
            },
            method: 'DELETE'
        });

        if (!data?.success) return;

        _titles.value = _titles.value.filter(t => !ids.includes(t.id));
    }


    // * Edit Mode
    function toggleEditMode() {
        if (!selectedList.value) return;

        selectedList.value!.editMode.enabled = !selectedList.value?.editMode.enabled;
    }


    return {
        lists,
        categories,
        titles,
        selectedList,
        selectedCategory,

        getMyData,
        getTitleByCategoryId,

        selectLC,

        createList,
        createCategory,
        addTitles,

        moveTitles,
        likeTitles,

        deleteTitles,

        toggleEditMode
    }
});