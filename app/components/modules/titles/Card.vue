<template>
    <TitleContextMenu
        :title="title"
        :disabled="disableContextMenu"

        v-slot="{ show, hide }"
    >
        <div :class="['title-card', { selected }]"
            @click="$emit('click', $event)"

            @contextmenu.stop.prevent="show"
        >
            <div class="image">
                <div class="media">
                    <span>{{ $t(data?.mediaType === 0 ? 'movie' : 'tv') }}</span>
                </div>

                <Parent v-if="showParents"
                    :title="title"
                />
                
                <div class="badges">
                    <BadgePrivate v-if="title.private"/>
                    <BadgeRating v-if="title.rating > 0"
                        :size="12"
                        :step="title.rating"
                        :canEdit="canEditHeart"

                        @updateStep="title.rated($event)"
                        @click.prevent.stop=""    
                    />
                    <BadgeLike v-if="title.liked > 0"
                        :size="12"
                        :step="title.liked"
                        :canEdit="canEditHeart"

                        @updateStep="title.like($event)"
                        @click.prevent.stop=""
                    />
                </div>

                <Image
                    :src="getImageTMDB(data?.poster_path)"
                    alt="Title Poster"
                />
            </div>

            <div class="details">
                <div class="name">{{ data.name ?? data.title }}</div>

                <div class="genres" v-if="data?.genres?.length > 0">{{ data.genres.map(g => g.name).join(', ') }}</div>

                <ul>
                    <li v-if="titleRuntime">
                        <Timer :size="10"/>

                        <span>{{ titleRuntime }}</span>
                    </li>

                    <li v-if="data?.vote_average > 0">
                        <Star :size="10" color="yellow"/>
                        <span>{{ data?.vote_average.toFixed(1) }}/{{ data?.vote_count }}</span>
                    </li>

                    <li v-if="titleDate">
                        <Calendar :size="10"/>

                        <span>{{ titleDate }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </TitleContextMenu>
</template>

<script lang="ts" setup>

// * Components
import Image from '~/components/ui/Image.vue';
import TitleContextMenu from './Context.vue';

// * Badges
import BadgePrivate from './badges/Private.vue';
import BadgeRating from './badges/Rating.vue';
import BadgeLike from './badges/Like.vue';

import { Timer, Star, EyeOff, Calendar } from 'lucide-vue-next';

// * Types
import type { DashboardTitle } from '~/libs/dashboard';
import Parent from './badges/Parent.vue';


const $config = useRuntimeConfig();


const $route = useRoute();


const $cacheUsers = useDashboardsStore();


const props = defineProps<{
    title: DashboardTitle;
    selected?: boolean;
    disableContextMenu?: boolean;
    canEditHeart?: boolean;
    showParents?: boolean;
}>();

defineEmits({
    click(event: MouseEvent) {
        return event;
    }
});


const data = computed(() => props.title?.tmdb);

const titleDate = computed(() => {
    const { mediaType } = data.value;

    const firstYear = new Date(mediaType === 0 ? data.value?.release_date : data.value?.first_air_date).getFullYear();

    if (isNaN(firstYear)) return null;

    return firstYear + (mediaType === 0 || data.value?.first_air_date.slice(0, 4) === data.value?.last_air_date.slice(0, 4) ? '' : ` - ${new Date(data.value?.last_air_date).getFullYear()}`);
});

const titleRuntime = computed(() => {
    if (data.value.mediaType === 0) {
        const runtime = data?.value?.runtime;

        if (runtime < 1) return null;

        return runtimeToHM(runtime);
    } else {
        const { number_of_seasons = 0, number_of_episodes = 0, last_episode_to_air } = data.value;

        return `~${last_episode_to_air && runtimeToHM(last_episode_to_air?.runtime)} (${number_of_seasons}/${number_of_episodes})`;
    }
});

</script>

<style lang="scss" scoped>

.title-card {
    cursor: pointer;
    position: relative;
    border: 1px dashed var(--hx-background-transparent);
    border-radius: var(--hx-border-radius);
    box-sizing: border-box;
    transition: all .2s;
    user-select: none;
    overflow: hidden;

    &:hover,
    &.selected {
        .image {
            .media,
            .badges,
            :deep(.parent) {
                opacity: 1;
            }
        }
        .details {
            transform: translateY(1px);
        }
    }

    &.selected {
        transform: scale(0.95);
        box-shadow: 0px 0px 0px 6px var(--hx-background-transparent);
    }

    .image {
        width: 100%;
        position: relative;
        padding-bottom: 157%;
        overflow: hidden;
        transition: .2s;

        .media {
            padding: 0 6px;
            height: 20px;
            position: absolute;
            top: 4px;
            left: 4px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 20px;
            color: var(--hx-text-primary);
            border-radius: var(--hx-border-radius);
            background-color: #00000045;
            backdrop-filter: blur(5px);
            box-sizing: border-box;
            transition: .2s;
            opacity: .5;
            z-index: 2;
        }

        :deep(.parent) {
            position: absolute;
            top: 28px;
            left: 4px;
            font-size: 10px;
            opacity: .5;
        }

        .badges {
            display: flex;
            position: absolute;
            top: 4px;
            right: 4px;
            border-radius: var(--hx-border-radius);
            background-color: #00000045;
            backdrop-filter: blur(5px);
            transition: .2s;
            overflow: hidden;
            opacity: .5;
            z-index: 3;

            :deep(div.badge) {
                cursor: pointer;
                display: flex;
                width: 20px;
                height: 20px;
                color: var(--hx-text-primary);
                line-height: 24px;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                transition: .2s;
                user-select: none;
                opacity: .7;
                z-index: 2;

                &:hover {
                    opacity: 1;
                    background-color: #00000045;
                }
            }
        }

        ::v-deep(.ui-image) {
            width: 100%;
            height: 100%;
            position: absolute;
            object-fit: cover;
            object-position: center;
            z-index: 1;
        }
    }
    
    .details {
        display: flex;
        padding: 4px 8px;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        flex-direction: column;
        border-radius: var(--hx-border-radius);
        background-color: #00000095;
        backdrop-filter: blur(5px);
        box-sizing: border-box;
        transform: translateY(calc(100% - 23px));
        transition: .2s;
        z-index: 5;

        .name {
            font-size: 14px;
            font-weight: 700;
            color: var(--hx-text-primary);
            word-break: break-word;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .genres {
            margin: 2px 0;
            color: var(--hx-text-secondary);
            font-size: 10px;
        }

        ul {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;

            li {
                display: flex;
                padding: 2px 4px;
                color: var(--hx-text-secondary);
                font-size: 10px;
                border-radius: 25px;
                align-items: center;
                background-color: #00000045;

                span {
                    margin-left: 4px;
                }
            }
        }
    }
}

</style>