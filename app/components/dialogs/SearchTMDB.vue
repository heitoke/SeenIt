<template>
    <Dialog>
        <DialogTrigger as-child>
            <slot/>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create new list</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            
            <div class="relative w-full max-w-sm items-center">
                <Input id="search" type="text" placeholder="Name title" class="pl-8"
                    @input="onInput"
                />
                
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                    <Search class="size-4 text-muted-foreground" />
                </span>
            </div>

            <ul>
                <TitleCard v-for="title of titles" :key="title.id"
                    :title="({ data: title } as any)"
                    :selected="selectedTitles.has(title.id)"
                    :disable-context-menu="true"

                    @click="selectedTitles.has(title.id) ? selectedTitles.delete(title.id) : selectedTitles.set(title.id, title)"
                />
            </ul>

            <DialogFooter>
                <DialogClose>
                    <Button :disabled="selectedTitles.size < 1"
                        @click="$emit('save', [...selectedTitles.values()])"
                    >
                        <Plus/>
                        <span>Add titles ({{ selectedTitles.size }})</span>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>

// * Components
import TitleCard from '../TitleCard.vue';

import { Search, Plus } from 'lucide-vue-next';

// * Types
import type { TMDBTitleInSearch } from '~~/types/tmdb';


defineEmits({
    save(data: Array<TMDBTitleInSearch>) {
        return data;
    }
});


const titles = ref<Array<TMDBTitleInSearch>>([]);

const selectedTitles = ref<Map<number, TMDBTitleInSearch>>(new Map());


let timer: NodeJS.Timeout;

function onInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement)!.value;

    clearTimeout(timer);
    
    timer = setTimeout(async () => {
        const data = await $fetch('/api/tmdb/search', {
            query: {
                text: value,
                lang: 'ru-RU'
            }
        });

        titles.value = data.results.filter(t => t.media_type === 'movie' || t.media_type === 'tv');
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