<template>
    <TitleContextMenu :disabled="disableContextMenu" :title="title">
        <div :class="['title-card', { selected }]"
            @click="$emit('click', $event)"
        >
            <div class="image">
                <div class="media">{{ $t(data?.mediaType) }}</div>
                
                <div class="badges">
                    <div @click.prevent.stop="" v-if="title?.private">
                        <EyeOff :size="14"/>
                    </div>
                    <div>
                        <TitleHeart :step="title.liked" :disabledTooltip="!canEditHeart"
                            @updateStep="title.like($event)"
                        />
                    </div>
                </div>
                <img :src="titlePoster" alt="Title Poster">
            </div>

            <div class="details">
                <div class="name">{{ data.name ?? data.title }}</div>

                <div class="genres" v-if="data?.genres?.length">{{ data.genres.map(g => g.name).join(', ') }}</div>

                <ul>
                    <li v-if="data?.runtime">
                        <Timer :size="10"/>
                        <span v-if="(data?.runtime / 60) >= 1">{{ Math.floor(data?.runtime / 60) }}h</span>
                        <span>{{ data?.runtime % 60 }}m</span>
                    </li>
                    <li>
                        <Star :size="10" color="yellow"/>
                        <span>{{ data?.vote_average.toFixed(1) }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </TitleContextMenu>
</template>

<script lang="ts" setup>

// * Components
import TitleContextMenu from './Context.vue';
import TitleHeart from './Heart.vue';

import { Trash, Heart, HeartOff, Timer, Star, Eye, EyeOff } from 'lucide-vue-next';


// * Stores
import { useListsStore } from '~/stores/lists';

// * Types
import type { Title } from '~~/types/list';


const $route = useRoute();


const $lists = useListsStore();


const props = defineProps<{
    title: Title;
    selected?: boolean;
    disableContextMenu?: boolean;
    canEditHeart?: boolean;
}>();

defineEmits({
    click(event: MouseEvent) {
        return event;
    }
});


const data = computed(() => props.title?.data);

const titlePoster = computed(() => `https://seenit.heito.xyz/api/images/t/p/original/${data.value?.poster_path}`);

</script>

<style lang="scss" scoped>

.title-card {
    cursor: pointer;
    position: relative;
    border-radius: 7px;
    overflow: hidden;

    &:hover {
        .details {
            top: auto;
            bottom: 0px;
        }
    }

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
        overflow: hidden;
        transition: .2s;

        .media {
            padding: 2px 4px;
            position: absolute;
            top: 4px;
            left: 4px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--secondary-foreground);
            border-radius: 7px;
            background-color: #00000045;
            backdrop-filter: blur(5px);
            z-index: 2;
        }

        .badges {
            display: flex;
            position: absolute;
            top: 4px;
            right: 4px;
            gap: 4px;
            z-index: 3;

            div {
                cursor: pointer;
                display: flex;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                align-items: center;
                justify-content: center;
                background-color: #00000045;
                backdrop-filter: blur(5px);
                user-select: none;
                z-index: 2;

                &:active {
                    transform: scale(0.95);
                }

                &.active {
                    color: red;
                }
            }
        }

        img {
            width: 100%;
            height: 100%;
            position: absolute;
            // max-height: 128px;
            object-fit: cover;
            object-position: center;
            z-index: 1;

            &:nth-child(4) {
                left: 10px;
                filter: blur(5px);
            }
        }
    }
    
    .details {
        display: flex;
        padding: 4px 8px;
        width: 100%;
        position: absolute;
        top: calc(100% - 28px);
        left: 0;
        flex-direction: column;
        background-color: #00000045;
        backdrop-filter: blur(5px);
        transition: .2s;
        z-index: 5;

        .name {
            font-size: 14px;
            font-weight: 700;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .genres {
            font-size: 10px;
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