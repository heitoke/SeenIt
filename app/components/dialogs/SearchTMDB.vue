<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <slot/>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ $t('search') }} TMDB</DialogTitle>
                <DialogDescription>{{ $t('searchTmdb.description') }}</DialogDescription>
            </DialogHeader>

            <Tabs v-model="type">
                <TabsList class="w-full">
                    <TabsTrigger value="multi">{{ $t('movie') }} & {{ $t('tv') }}</TabsTrigger>
                    <TabsTrigger value="movie">{{ $t('movie') }}</TabsTrigger>
                    <TabsTrigger value="tv">{{ $t('tv') }}</TabsTrigger>
                </TabsList>

                <div class="relative w-full max-w-sm items-center">
                    <Input id="search" type="text" :placeholder="$t('nameTitle')" class="pl-8"
                        @input="onInput"
                    />
                    
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                        <Search class="size-4 text-muted-foreground" />
                    </span>
                </div>
            </Tabs>

            <ul class="titles">
                <li v-for="title of listTitles" :key="title.id"
                    :class="{ selected: selectedTitles.has(title.id) }"

                    @click="selectedTitles.has(title.id) ? selectedTitles.delete(title.id) : selectedTitles.set(title.id, title)"
                >
                    <div class="image">
                        <img :src="`https://seenit.heito.xyz/api/images/t/p/original/${title?.poster_path}`" alt="">
                    </div>

                    <div class="details">
                        <div class="name">{{ title?.title || title?.name }}</div>

                        <ul>
                            <li>
                                <Star :size="10" color="yellow"/>
                                <span>{{ title?.vote_average.toFixed(1) }}</span>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>

            <DialogFooter>
                <Button :disabled="selectedTitles.size < 1 || loading"
                    @click="$emit('save', {
                        titles: [...selectedTitles.values()],
                        close: () => {
                            open = false;

                            titles = [];
                            selectedTitles.clear();
                        },
                        loading: (bool: boolean) => loading = bool
                    })"
                >
                    <template v-if="loading">
                        <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                        {{ $t('pleaseWait') }}...
                    </template>
                    <template v-else>
                        <Plus/>
                        <span>{{ $t('addTitles') }} ({{ selectedTitles.size }})</span>
                    </template>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>

import { Search, Plus, Loader2, Star } from 'lucide-vue-next';
import { useListsStore } from '~/stores/lists';

// * Types
import type { TMDBTitleInSearch } from '~~/types/tmdb';


interface EmitSave {
    titles: Array<TMDBTitleInSearch>;
    loading(bool: boolean): void;
    close(): void;
}


defineEmits({
    save(data: EmitSave) {
        return data;
    }
});


const props = defineProps<{
    userId: number;
    listId: number;
}>();


const $lists = useListsStore();


const $cl = $lists.get(props.userId);


const open = ref(false);
const loading = ref(false);
const type = ref<'multi' | 'movie' | 'tv'>('multi');


const titles = ref<Array<TMDBTitleInSearch>>([]);
const selectedTitles = ref<Map<number, TMDBTitleInSearch>>(new Map());


const ignoreTitleIds = computed(() => {
    const list = $cl.get('list', props.listId);

    if (!list) return [];

    return list.categories.reduce((a, b) => ([ ...a, ...b.titles.map(t => t.data.id) ]), [] as Array<number>);
});

const listTitles = computed(() => titles.value.filter(t => !ignoreTitleIds.value.includes(t.id)));



let timer: NodeJS.Timeout;

function onInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement)!.value;

    clearTimeout(timer);
    
    timer = setTimeout(async () => {
        const data = await $fetch('/api/tmdb/search', {
            query: {
                type: type.value,
                text: value,
                lang: 'ru-RU'
            }
        });

        titles.value = data.results.filter(t => t?.media_type === 'movie' || t?.media_type === 'tv');
    }, 500);
}

</script>

<style lang="scss" scoped>

ul {
    max-height: 50vh;
    overflow-x: hidden;

    li {
        cursor: pointer;
        display: flex;
        padding: 4px;
        border-radius: 7px;
        border: 1px solid transparent;
        align-items: center;
        transition: .2s;

        & + li {
            margin-top: 4px;
        }

        &.selected {
            // border-color: var(--color-red-50);
            background-color: var(--secondary);

            .name {
                text-decoration: underline;
            }
        }

        .image {
            margin-right: 8px;
            width: 64px;
            height: 96px;
            border-radius: 7px;
            background-color: var(--secondary);
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
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
}

</style>