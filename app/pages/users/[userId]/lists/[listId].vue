<template>
    <NuxtPage/>
</template>

<script lang="ts" setup>

// * Types
import type { User } from '~~/types/db/user';


const $route = useRoute();


const userId = String($route.params?.userId);


const $dashboards = useDashboardsStore();


onMounted(() => {
    const listId = String($route.params?.listId);

    const $d = $dashboards.get(userId);

    $d.select(listId);
});


definePageMeta({
    name: 'user-lists-list'
});

</script>