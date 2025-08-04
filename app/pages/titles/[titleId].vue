<template>
    <div class="title">
        <div class="header"></div>
    </div>
</template>

<script lang="ts" setup>

// * Stores
import { useListsStore } from '~/stores/lists';

// * Types
import type { Title } from '~~/types/list';


const $route = useRoute();
const $router = useRouter();


const $lists = useListsStore();


const title = ref<Title>();


onMounted(() => {
    const titleId = Number($route.params?.titleId);

    if (isNaN(titleId)) return $router.back();

    const t = $lists.getTypeById('title', titleId);

    console.log(titleId, t)

    title.value = t;
});

</script>

<style lang="scss" scoped></style>