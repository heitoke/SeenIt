<template>
    <div class="user-likes">
        <div class="list">
            <TitleCard v-for="title of listLikedTitles" :key="title.id"
                :title="title"
                :canEditHeart="$cu.canEdit"
                :disableContextMenu="!$cu.canEdit"

                @click="navigateTo(`/titles/${title.id}`);"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

// * Components
import TitleCard from '~/components/modules/titles/Card.vue';


// * Store
import { useCacheUsersStore } from '~/stores/cacheUsers';


const $route = useRoute();

const $user = useSupabaseUser();

const $cacheUsers = useCacheUsersStore();


const $cu = $cacheUsers.get(Number($route.params?.userId));


const listLikedTitles = computed(() => {
    const likedTitles = $cu.titles.filter(t => t.liked > 0);

    return likedTitles
});


onMounted(async () => {
});


definePageMeta({
    name: 'user-likes',
    alias: [
        '/u/:userId/likes'
    ]
});

</script>

<style lang="scss" scoped>

.user-likes {
    .list {
        display: grid;
        grid-template-columns: repeat(6, 1fr);;
        gap: 12px;
    }

    @media (max-width: 1080px) {
        .list {
            grid-template-columns: repeat(5, 1fr);
        }
    }

    @media (max-width: 840px) {
        .list {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (max-width: 640px) {
        .list {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 460px) {
        .list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

</style>