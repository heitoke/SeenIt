<template>
    <ContextMenu>
        <ContextMenuTrigger>
            <div :class="['title-card', { selected }]"
                @click="$emit('click', $event)"
            >
                <div class="image">
                    <div class="media">{{ $t(data?.media_type) }}</div>
                    <div :class="['like', { active: title.liked }]"><Heart :size="14"/></div>
                    <img :src="titlePoster" alt="Title Poster">
                </div>

                <div class="details">
                    <div class="name">{{ data.name ?? data.title }} asd asd asdas das das da</div>
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
        </ContextMenuTrigger>
        <ContextMenuContent class="w-56" v-if="!disableContextMenu">
            <ContextMenuItem @click="title.like()">
                <Heart v-show="!title.liked"/>
                <HeartOff v-show="title.liked"/>

                <span>{{ title.liked ? 'Unliked' : 'Liked' }}</span>
            </ContextMenuItem>
            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    Move to...
                </ContextMenuSubTrigger>
                <ContextMenuSubContent class="w-48">
                    <!-- <ContextMenuSub v-for="list of $lists.lists" :key="list.id">
                        <ContextMenuSubTrigger>
                            {{ list.name }}
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent class="w-48">
                            <ContextMenuItem v-for="category of list.categories" :key="category.id"
                                @click="title.move(category.id)"
                            >
                                {{ category.name }}
                            </ContextMenuItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub> -->
                </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem @click="title.delete()">
                <Trash/>

                <span>Delete</span>
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
</template>

<script lang="ts" setup>

import { Trash, Heart, HeartOff, Timer, Star } from 'lucide-vue-next';

// * Stores
import { useListsStore } from '~/stores/lists';

// * Types
import type { Title } from '~~/types/list';


const $url = useRequestURL();


const $lists = useListsStore();


const props = defineProps<{
    title: Title;
    selected?: boolean;
    disableContextMenu?: boolean;
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

        .like {
            cursor: pointer;
            display: flex;
            width: 24px;
            height: 24px;
            position: absolute;
            top: 4px;
            right: 4px;
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