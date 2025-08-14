<template>
    <NuxtPage/>
</template>

<script lang="ts" setup>

import { useCacheUsersStore } from '~/stores/cacheUsers';

// * Types
import type { User } from '~~/types/user';


const $route = useRoute();


const userId = Number($route.params?.userId);
const listId = Number($route.params?.listId);


const $cacheUsers = useCacheUsersStore();


onMounted(() => {
    const listId = Number($route.params?.listId);

    if (isNaN(listId)) return;

    const $cu = $cacheUsers.get(userId);

    $cu.select('list', listId);
});


definePageMeta({
    name: 'user-lists-list'
});

</script>