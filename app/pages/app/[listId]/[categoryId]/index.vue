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


const props = defineProps<{
    list: DBList;
    category?: DBCategory;
}>();


const titles = ref<Array<DBTitle>>([]);


async function getTitleByCategoryId(categoryId: number) {
    if (!categoryId) return;

    const dataTitles = await $fetch<Array<DBTitle>>(`/api/lists/${props.list.id}/categories/${categoryId}/titles`);

    if (dataTitles.length < 1) return;

    titles.value = dataTitles;
}

onMounted(() => {
    const id = props.category?.id;

    if (!id) return;

    getTitleByCategoryId(id);
});

</script>

<style lang="scss" scoped>

.grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
}

</style>