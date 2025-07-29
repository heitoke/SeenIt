<template>
    <div class="block">
        <div class="nav">
            <Button v-for="category of categories" :key="category.id"
                :variant="selectedCategoryId === category.id ? 'default' : 'secondary'"

                @click="selectCategory(category.id)"
            >
                {{ category.name }}
            </Button>

            <NameField title="Create new category" @save="addNewCategory($event.name)">
                <Button variant="ghost">
                    <Plus/>
                    <span>Add</span>
                </Button>
            </NameField>
        </div>

        <NuxtPage :list="list" :category="selectedCategory"/>
    </div>
</template>

<script lang="ts" setup>

import { Plus } from 'lucide-vue-next';

// * Components
import NameField from '~/components/dialogs/NameField.vue';

// * Types
import type { DBList, DBCategory } from '~~/types/list';


const props = defineProps<{
    list: DBList;
}>();


const categories = ref<Array<DBCategory>>([]);

const selectedCategoryId = ref<number>(0);


const selectedCategory = computed(() => {
    return categories.value.find(c => c.id === selectedCategoryId.value);
});


async function getCategoriesByListId(listId: number) {
    const data = await $fetch<Array<DBCategory>>(`/api/lists/${listId}/categories`);

    console.log(data)

    if (data.length < 1) return;

    categories.value = data;

    selectCategory(data[0]!.id);
}


async function addNewCategory(name: string) {
    if (!name) return;

    const data = await $fetch<DBCategory>(`/api/lists/${props.list.id}/categories`, {
        body: {
            name
        },
        method: 'POST'
    });

    if (!data?.id) return;

    categories.value.push(data);

    if (categories.value.length === 1) selectCategory(data.id);
}

async function selectCategory(categoryId: number) {
    const category = categories.value.find(c => c.id === categoryId);
    
    if (!category) return;

    selectedCategoryId.value = category.id;

    await navigateTo(`/app/${props.list.id}/${category.id}`);
}


watch(() => props.list.id, (newId) => {
    getCategoriesByListId(newId);
});


onMounted(() => {
    getCategoriesByListId(props.list.id);
});

</script>

<style lang="scss" scoped>

.block {
    display: grid;
    grid-template-columns: 215px 1fr;
    width: 100%;
    gap: 12px;
}

.nav {
    display: flex;
    max-width: 215px;
    width: 215px;
    flex-direction: column;
    gap: 12px;

    button {
        cursor: pointer;
    }
}

</style>