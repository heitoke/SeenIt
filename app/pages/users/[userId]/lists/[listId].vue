<template>
    <NuxtPage/>
</template>

<script lang="ts" setup>

import { useListsStore } from '~/stores/lists';

// * Types
import type { User } from '~~/types/user';


const $route = useRoute();


const userId = Number($route.params?.userId);
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