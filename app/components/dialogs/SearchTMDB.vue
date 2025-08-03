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

            <ul>
                <TitleCard v-for="title of listTitles" :key="title.id"
                    :title="({ data: title } as any)"
                    :selected="selectedTitles.has(title.id)"
                    :disable-context-menu="true"

                    @click="selectedTitles.has(title.id) ? selectedTitles.delete(title.id) : selectedTitles.set(title.id, title)"
                />
            </ul>

            <DialogFooter v-if="selectedTitles.size > 0">
                <Button :disabled="loading"
                    @click="$emit('save', {
                        titles: [...selectedTitles.values()],
                        close: () => open = false,
                        loading: (bool: boolean) => loading = bool
                    })"
                >
                    <template v-if="loading">
                        <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                        Please wait...
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

// * Components
import TitleCard from '../TitleCard.vue';

import { Search, Plus, Loader2 } from 'lucide-vue-next';
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
    userId: string;
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
    display: grid;
    max-height: 50vh;
    grid-template-columns: 1fr 1fr 1fr;
    overflow-x: hidden;
    gap: 12px;
}

</style>