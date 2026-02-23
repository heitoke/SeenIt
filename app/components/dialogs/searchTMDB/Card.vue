<template>
    <div :class="['title', { selected }]">
        <div class="image">
            <Image :src="`https://tmdbimg.rootu.top/t/p/original${title?.poster_path}`" v-if="title?.poster_path"/>
        </div>

        <div class="details">
            <div class="name">{{ title?.title || title?.name }}</div>

            <ul>
                <li>
                    <span>{{ $t(title?.media_type) }}</span>
                </li>

                <li v-if="title?.vote_average > 0">
                    <Star :size="10" color="yellow"/>
                    <span>{{ title?.vote_average.toFixed(1) }}/{{ title?.vote_count }}</span>
                </li>

                <li v-if="title?.release_date || title?.first_air_date">
                    <Calendar :size="10"/>
                    <span>{{ new Date(title?.release_date || title?.first_air_date).getFullYear() }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

// * Components
import Image from '~/components/ui/Image.vue';

import { Star, Calendar } from 'lucide-vue-next';

// * Types
import type { TMDBTitleInSearch } from '~~/types/tmdb';


const props = defineProps<{
    title: TMDBTitleInSearch;
    selected?: boolean;
}>();

</script>

<style lang="scss" scoped>

.title {
    cursor: pointer;
    display: flex;
    padding: 4px;
    border-radius: 7px;
    border: 1px solid transparent;
    align-items: center;
    transition: .2s;

    &.selected {
        background-color: var(--secondary);

        .name {
            text-decoration: underline;
        }
    }

    .image {
        margin-right: 8px;
        max-width: 64px;
        min-width: 64px;
        height: 96px;
        border-radius: 7px;
        background-color: var(--secondary);
        overflow: hidden;

        ::v-deep(.ui-image) {
            height: 96px;
        }
    }

    .details {
        .name {
            font-size: 14px;
            font-weight: 600;
        }

        ul {
            display: flex;
            gap: 2px;

            li {
                display: flex;
                padding: 2px 4px;
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