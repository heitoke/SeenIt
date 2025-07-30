<template>
    <div :class="['title-card', { selected }]">
        <div class="image">
            <div class="media">{{ title?.media_type }}</div>
            <img :src="`${$url.origin}/api/images/t/p/original/${title.poster_path}`" alt="">
        </div>
    
        <div>{{ title.name ?? title.title }}</div>
    </div>
</template>

<script lang="ts" setup>

// * Types
import type { TMDBTitleInSearch } from '~~/types/tmdb';


const $url = useRequestURL();


defineProps<{
    title: TMDBTitleInSearch;
    selected?: boolean;
}>();

</script>

<style lang="scss" scoped>

.title-card {
    cursor: pointer;

    &.selected {
        .image {
            transform: scale(0.90);
            box-sizing: border-box;
            // border: 8px solid #fff;
            box-shadow: 0px 0px 0px 6px #fff;
        }
    }

    .image {
        width: 100%;
        position: relative;
        padding-bottom: 157%;
        border-radius: 7px;
        overflow: hidden;
        transition: .2s;

        .media {
            padding: 0 4px;
            position: absolute;
            top: 2px;
            left: 2px;
            font-size: 10px;
            text-transform: uppercase;
            color: var(--secondary-foreground);
            border-radius: 5px;
            background-color: var(--secondary);
            z-index: 2;
        }

        img {
            width: 100%;
            height: 100%;
            position: absolute;
            // max-height: 128px;
            object-fit: cover;
            object-position: center;
            z-index: 1;
        }
    }
    

    div {
        margin-top: 2px;
        font-weight: 700;
        font-size: 12px;
    }
}

</style>