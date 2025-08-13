<template>
    <div class="title" v-if="data">
        <div class="header">
            <img :src="titleBackdrop" alt="Title Backdrop">

            <div class="badges left">
                <div class="media">{{ $t(data?.mediaType) }}</div>

                <div class="rating">
                    <Star :size="16" class="fill-yellow-400 stroke-yellow-400"/>
                    <span>{{ data?.vote_average?.toFixed(1) }}/<span>{{ data?.vote_count }}</span></span>
                </div>
            </div>

            <div class="badges right">
                <div><TitleHeart :size="16" :step="title?.liked"/></div>
            </div>

            <div class="details">
                <div class="name">{{ data?.title || data?.name }}</div>

                <p class="text">{{ data?.overview }}</p>

                <div class="flex gap-2 items-center">
                    <div class="gernes">{{ data?.genres.map(g => g.name).join(', ') }}</div>
                </div>
            </div>
        </div>

        <!-- <div class="group">
            <h2>Сезоны</h2>

            <ul class="seasons">
                <li v-for="season of data?.seasons" :key="season.id">
                    <img :src="`https://seenit.heito.xyz/api/images/t/p/original/${season?.poster_path}`" alt="Season" v-if="season?.poster_path">
                </li>
            </ul>
        </div> -->
    </div>
</template>

<script lang="ts" setup>

// * Components
import TitleHeart from '~/components/modules/titles/Heart.vue';

import { Heart, Star } from 'lucide-vue-next';

// * Stores
import { useListsStore } from '~/stores/lists';

// * Types
import type { Title } from '~~/types/list';


const $route = useRoute();
const $router = useRouter();


const $lists = useListsStore();


const title = ref<Title>();


const data = computed(() => title.value?.data);

const titleBackdrop = computed(() => `https://seenit.heito.xyz/api/images/t/p/original/${data.value?.backdrop_path}`);


async function loadTitle(titleId: number) {
    const data = await $fetch(`/api/titles/${titleId}`);

    if (!data?.id) return;

    const $cl = $lists.get(data.category.list.user_id);

    if (!$cl.alreadyLoadData) await $cl.loadUserData();

    const t = $lists.getTypeById('title', titleId);

    title.value = t;

    console.log(title.value);
}


onMounted(() => {
    const titleId = Number($route.params?.titleId);

    if (isNaN(titleId)) return $router.back();

    const t = $lists.getTypeById('title', titleId);

    if (!t) return loadTitle(titleId);

    title.value = t;
});

</script>

<style lang="scss" scoped>

.page.title {
}

.header {
    width: 100%;
    min-height: 215px;
    position: relative;
    border-radius: 17px;
    box-sizing: border-box;
    // background-color: var(--secondary);
    overflow: hidden;

    img {
        mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
    }

    .badges {
        display: flex;
        position: absolute;
        top: 24px;
        align-items: center;
        gap: 4px;

        &.left {
            left: 24px;

            & > div {
                padding: 4px 8px;
                border-radius: 7px;

                &.media {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                &.rating {
                    display: flex;
                    align-items: center;

                    & > span {
                        margin-left: 4px;
                        font-size: 12px;

                        span {
                            font-size: 10px;
                        }
                    }
                }
            }
        }

        &.right {
            right: 24px;

            & > div {
                padding: 8px;
                text-transform: uppercase;
                border-radius: 50%;
            }
        }

        & > div {
            background-color: #00000045;
            backdrop-filter: blur(5px);
        }
    }

    .details {
        display: flex;
        padding: 24px;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        justify-content: end;
        flex-direction: column;

        .name {
            font-size: 42px;
            font-weight: 700;
        }

        .text {
            margin-bottom: 8px;
            font-size: 14px;
            opacity: .7;
        }
    
        .gernes {
            font-size: 14px;
        }
    }
}

.group {
    margin-top: 24px;

    h2 {
        font-size: 24px;
        font-weight: 600;
    }
}

</style>