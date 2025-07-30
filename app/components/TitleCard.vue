<template>
    <ContextMenu>
        <ContextMenuTrigger>
            <div :class="['title-card', { selected }]"
                @click="$emit('click', $event)"
            >
                <div class="image">
                    <div class="media">{{ data?.media_type }}</div>
                    <div :class="['like', { active: title.liked }]"><Heart :size="16"/></div>
                    <img :src="`${$url.origin}/api/images/t/p/original/${data.poster_path}`" alt="">
                </div>
            
                <div>{{ data.name ?? data.title }}</div>
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
                    <ContextMenuSub v-for="list of $lists.lists" :key="list.id">
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
                    </ContextMenuSub>
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

import { Trash, Heart, HeartOff } from 'lucide-vue-next';

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
})


const data = computed(() => props.title?.data);

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

        .like {
            position: absolute;
            top: 2px;
            right: 4px;
            z-index: 2;

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
        }
    }
    

    div {
        margin-top: 2px;
        font-weight: 700;
        font-size: 12px;
    }
}

</style>