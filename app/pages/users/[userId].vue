<template>
    <div class="user">
        <NuxtPage/>
    </div>
</template>

<script lang="ts" setup>

const $route = useRoute();


onMounted(() => {
    const { listId, categoryId } = $route.params;

    if (listId || categoryId) return;

    navigateTo(`/u/${$route.params?.userId}/lists`);
});


definePageMeta({
    name: 'user',
    alias: [
        '/u/:userId'
    ]
});

</script>

<style lang="scss" scoped></style>