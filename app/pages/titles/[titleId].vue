<template>
    <div class="title" v-if="data">
        <div class="header">
            <Image :src="getImageTMDB(data.backdrop_path)" alt="Title Backdrop"/>

            <div class="badges left">
                <div class="media">{{ $t(data?.mediaType === 0 ? 'movie' : 'tv') }}</div>

                <div class="rating">
                    <Star :size="14" style="fill: yellow; stroke: yellow;"/>
                    <span>{{ data?.vote_average?.toFixed(1) }}/<span>{{ data?.vote_count }}</span></span>
                </div>
            </div>

            <div class="badges right">
                <div><BadgeLike :size="14" :step="title?.liked"/></div>
            </div>

            <div class="details">
                <div class="name">{{ data?.title || data?.name }}</div>

                <p class="text">{{ data?.overview }}</p>

                <div class="flex gap-2 items-center">
                    <div class="gernes">{{ data?.genres.map(g => g.name).join(', ') }}</div>
                </div>
            </div>
        </div>

        <GroupSeasons v-if="title && data.mediaType === 1"
            :title="title"
        />

        <GroupMedia v-if="title"
            :title="title"
        />
        
        <GroupRecommendations v-if="title"
            :title="title"
        />
    </div>
</template>

<script lang="ts" setup>

// * Components
import GroupSeasons from '~/components/modules/pages/title/GroupSeasons.vue';
import GroupMedia from '~/components/modules/pages/title/GroupMedia.vue';
import GroupRecommendations from '~/components/modules/pages/title/GroupRecommendations.vue';
import BadgeLike from '~/components/modules/titles/badges/Like.vue';
import Image from '~/components/ui/Image.vue';

import { Star } from 'lucide-vue-next';

// * Types
import type { DashboardTitle } from '~/libs/dashboard';


const $route = useRoute();
const $router = useRouter();


const $dashboards = useDashboardsStore();


const title = ref<DashboardTitle>();


const data = computed(() => title.value?.tmdb);


async function loadTitle(titleId: string) {
    const data = await $fetch(`/api/titles/${titleId}`);

    if (!data?._id) return;

    const $d = $dashboards.get(data.category.list.user._id);

    if (!$d.alreadyLoadUser) await $d.loadUser();

    const cacheTitle = await $d.titles.get(String(data?._id));

    if (!cacheTitle) return;

    title.value = cacheTitle;
}


onMounted(() => {
    const titleId = String($route.params?.titleId);

    if (!titleId) return $router.back();

    const cacheTitle = $dashboards.getTypeById('title', titleId);

    if (!cacheTitle) return loadTitle(titleId);

    title.value = cacheTitle;
});

</script>

<style lang="scss" scoped>

.header {
    width: 100%;
    min-height: 215px;
    position: relative;
    border-radius: var(--hx-border-radius);
    box-sizing: border-box;
    overflow: hidden;
    
    ::v-deep(.ui-image) {
        max-width: 100%;
        mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
        background-color: #ffffff15;
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
                display: flex;
                padding: 4px 8px;
                height: 24px;
                color: var(--hx-text-primary);
                font-size: 12px;
                border-radius: var(--hx-border-radius);
                align-items: center;
                box-sizing: border-box;

                &.media {
                    font-weight: 700;
                    text-transform: uppercase;
                }

                &.rating {

                    & > span {
                        margin-left: 4px;

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
                display: flex;
                width: 24px;
                height: 24px;
                text-transform: uppercase;
                align-items: center;
                justify-content: center;
                border-radius: var(--hx-border-radius);
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
        box-sizing: border-box;

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


@media (max-width: 780px) {
    .header {
        .badges {
            top: 12px;

            &.left {
                left: 12px;
            }

            &.right {
                right: 12px;
            }
        }

        .details {
            position: relative;
            top: auto;
            left: auto;
        }
    }
}

</style>