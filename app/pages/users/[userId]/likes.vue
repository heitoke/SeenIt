<template>
    <div class="user-likes">
        <div class="grid-titles" v-if="listTitles?.length > 0">
            <TitleCard v-for="title of listTitles" :key="title._id"
                :title="(title as DashboardTitle)"
                :canEditHeart="$d.canEdit"
                :disableContextMenu="!$d.canEdit"
                :showParents="true"

                @click="onClickTitle(title as DashboardTitle)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

// * Components
import TitleCard from '~/components/modules/titles/Card.vue';

// * Types
import type { DashboardTitle } from '~/libs/dashboard';


const $route = useRoute();


const $dashboards = useDashboardsStore();

const $d = $dashboards.get(String($route.params?.userId));


const page = ref<[number, number]>([20, 1]);


const listTitles = computed(() => {
    const [size, pageCount] = page.value;

    return $d.likedTitles.slice(0, pageCount * size) || [];
});


function onClickTitle(title: DashboardTitle) {
    return navigateTo(`/titles/${title._id}`);
}


function onScroll(event: Event) {
    if (!document.scrollingElement) return;

    const { scrollHeight, scrollTop } = document.scrollingElement!;

    if (window.innerHeight + scrollTop > scrollHeight - (window.innerHeight / 6)) {
        page.value[1]++;
    }
}


onMounted(() => {
    document.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
    document.removeEventListener('scroll', onScroll);
});


definePageMeta({
    name: 'user-likes',
    alias: [
        '/u/:userId/likes'
    ]
});

</script>

<style lang="scss" scoped>

.grid-titles {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    z-index: 2;
}


@media (max-width: 840px) {
    .grid-titles {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (max-width: 640px) {
    .grid-titles {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 460px) {
    .grid-titles {
        grid-template-columns: repeat(2, 1fr);
    }
}

</style>