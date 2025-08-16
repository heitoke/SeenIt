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
                        :model-value="titles[type].text"

                        @input="onInput"
                    />
                    
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                        <Search class="size-4 text-muted-foreground" />
                    </span>
                </div>
            </Tabs>

            <ul class="titles">
                <Card v-for="title of listTitles" :key="title.id"
                    :title="title"
                    :selected="selectedTitles.has(title.id)"

                    @click="selectedTitles.has(title.id) ? selectedTitles.delete(title.id) : selectedTitles.set(title.id, title)"
                />
            </ul>

            <DialogFooter>
                <Popover v-if="selectedTitles.size > 0">
                    <PopoverTrigger>
                        <Button>
                            <ChevronUp/>

                            <span>{{ $t('selected') }} <b>{{ selectedTitles.size }}</b></span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent :side="'top'" style="min-width: clamp(320px, 50vw, 440px);">
                        <ul class="titles">
                            <Dialog v-for="[id, title] of selectedTitles" :key="title.id">
                                <DialogTrigger as-child>
                                    <Card :title="title" :selected="true"/>
                                </DialogTrigger>
                                <DialogContent class="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>{{ $t('delete') }} <b>{{ title?.title || title?.name }}</b></DialogTitle>
                                        <DialogDescription>{{ $t('confirmDelete.description') }}</DialogDescription>
                                    </DialogHeader>

                                    <Card :title="title" style="padding: 0;"/>

                                    <DialogFooter>
                                        <DialogClose>
                                            <Button variant="secondary">{{ $t('cancel') }}</Button>
                                        </DialogClose>
                                        
                                        <DialogClose>
                                            <Button variant="destructive" @click="selectedTitles.delete(id)">{{ $t('delete') }}</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </ul>

                        <Dialog>
                            <DialogTrigger as-child>
                                <Button variant="destructive" style="margin-top: 12px;" v-if="selectedTitles.size > 3">
                                    <span>{{ $t('clear') }}</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent class="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{{ $t('clear') }}</DialogTitle>
                                    <DialogDescription>-_^</DialogDescription>
                                </DialogHeader>
                                
                                <DialogFooter>
                                    <DialogClose>
                                        <Button variant="secondary">{{ $t('cancel') }}</Button>
                                    </DialogClose>
                                    
                                    <DialogClose>
                                        <Button variant="destructive" @click="selectedTitles.clear()">{{ $t('delete') }}</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </PopoverContent>
                </Popover>
                

                <Button :disabled="selectedTitles.size < 1 || loading"
                    @click="$emit('save', {
                        titles: [...selectedTitles.values()],
                        close: () => {
                            open = false;

                            titles[type] = { text: '', list: [] };
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
                        <span>{{ $t('addTitles') }}</span>
                    </template>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>

import Card from './searchTMDB/Card.vue';

import { Search, Plus, Loader2, ChevronUp } from 'lucide-vue-next';
import { useCacheUsersStore } from '~/stores/cacheUsers';

// * Types
import type { TMDBTitleInSearch } from '~~/types/tmdb';


interface EmitSave {
    titles: Array<TMDBTitleInSearch>;
    loading(bool: boolean): void;
    close(): void;
}

type Type = 'multi' | 'movie' | 'tv';


defineEmits({
    save(data: EmitSave) {
        return data;
    }
});


const props = defineProps<{
    userId: number;
    listId: number;
}>();


const $cacheUsers = useCacheUsersStore();


const $cu = $cacheUsers.get(props.userId);


const open = ref(false);
const loading = ref(false);
const type = ref<Type>('multi');


const titles = ref<Record<Type, { text: string, list: Array<TMDBTitleInSearch> }>>({
    multi: { text: '', list: [] },
    movie: { text: '', list: [] },
    tv: { text: '', list: [] }
});
const selectedTitles = ref<Map<number, TMDBTitleInSearch>>(new Map());


const ignoreTitleIds = computed(() => {
    const list = $cu.get('list', props.listId);

    if (!list) return [];

    return list.categories.reduce((a, b) => ([ ...a, ...b.titles.map(t => t.data.id) ]), [] as Array<number>);
});

const listTitles = computed(() => titles.value[type.value].list.filter(t => !ignoreTitleIds.value.includes(t.id)));


let timer: NodeJS.Timeout;

function onInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement)!.value;

    clearTimeout(timer);

    if (!value || value.trim() === '') return;

    titles.value[type.value].text = value;
    
    timer = setTimeout(async () => {
        const data = await $fetch('/api/tmdb/search', {
            query: {
                type: type.value,
                text: value,
                lang: 'ru-RU'
            }
        });

        titles.value[type.value].list = data.results.filter(t => t?.media_type === 'movie' || t?.media_type === 'tv');
    }, 500);
}

</script>

<style lang="scss" scoped>

ul.titles {
    max-height: 50vh;
    overflow-x: hidden;

    .title {
        &:not(:last-child) {
            margin-bottom: 4px;
        }
    }
}

</style>