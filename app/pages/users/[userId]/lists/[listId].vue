<template>
    <NuxtPage/>
</template>

<script lang="ts" setup>

import { useListsStore } from '~/stores/lists';


const $route = useRoute();


const userId = String($route.params?.userId);
const listId = Number($route.params?.listId);


const $lists = useListsStore();


onMounted(() => {
    const listId = Number($route.params?.listId);

    if (isNaN(listId)) return;

    const $cl = $lists.get(userId);

    $cl.select('list', listId);
});


definePageMeta({
    name: 'user-lists-list'
});

</script>