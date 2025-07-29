<template>
    <div class="list-titles">
        <div class="grid">
            <TitleCard v-for="title of titles" :key="title.id" :title="title.data"/>
        </div>
    </div>
</template>

<script lang="ts" setup>

// * Components
import TitleCard from '~/components/TitleCard.vue';

// * Types
import type { DBList, DBCategory, DBTitle } from '~~/types/list';
import type { TMDBTitleInSearch } from '~~/types/tmdb';


const props = defineProps<{
    list: DBList;
    category: DBCategory;
}>();


const titles = ref<Array<DBTitle<TMDBTitleInSearch>>>([]);


async function getTitleByCategoryId(categoryId: number) {
    const data = await $fetch<Array<DBTitle>>(`/api/lists/${props.list.id}/categories/${categoryId}/titles`);

    if (data.length < 1) return;

    console.log('titles', props.list.id, props.category.id, data)

    titles.value = data as any;

    console.log(titles.value)
}


watch(() => props.category?.id, (newId) => {
    getTitleByCategoryId(newId);
});


onMounted(() => {
    getTitleByCategoryId(props.category?.id);
});

</script>

<style lang="scss" scoped>

.grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
}

</style>