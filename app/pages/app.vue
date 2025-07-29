<template>
    <main class="app">
        <div class="header">
            <Combobox v-model="selectedList" by="label">
                <ComboboxAnchor as-child>
                    <ComboboxTrigger as-child>
                        <Button variant="outline" class="justify-between" style="width: 215px;">
                            {{ selectedList?.name ?? 'Select list' }}

                            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </ComboboxTrigger>
                </ComboboxAnchor>

                <ComboboxList>
                    <div class="relative w-full max-w-sm items-center">
                        <ComboboxInput class="focus-visible:ring-0 border-0 border-b rounded-none h-10" placeholder="Select framework..." />
                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                            <Search class="size-4 text-muted-foreground" />
                        </span>
                    </div>

                    <ComboboxEmpty>
                        No framework found.
                    </ComboboxEmpty>

                    <ComboboxGroup>
                        <ComboboxItem
                            v-for="list in lists"
                            :key="list.id"
                            :value="list"

                            @select="selectList(list.id)"
                        >
                            {{ list.name }}

                            <ComboboxItemIndicator>
                                <Check :class="cn('ml-auto h-4 w-4')" />
                            </ComboboxItemIndicator>
                        </ComboboxItem>
                    </ComboboxGroup>
                </ComboboxList>
            </Combobox>

            <NameField
                title="Create new list"
                @save="addNewList($event.name)"
            >
                <Button class="add">
                    <Plus/>

                    <span v-if="!$route.params?.listId">Add list</span>
                </Button>
            </NameField>

            <SearchTMDB @save="addTitles($event)" v-if="$route.params?.listId && $route.params?.categoryId">
                <Button class="add">
                    <Plus/>

                    <span>Search title</span>
                </Button>
            </SearchTMDB>

            <div class="relative w-full max-w-sm items-center" v-if="$route.params?.listId && $route.params?.categoryId">
                <Input id="search" type="text" placeholder="Search..." class="pl-8" />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                    <Search class="size-4 text-muted-foreground" />
                </span>
            </div>
        </div>

        <NuxtPage :list="selectedList" v-if="selectedList?.id"/>
    </main>
</template>

<script lang="ts" setup>

// * Components
import NameField from '~/components/dialogs/NameField.vue';
import SearchTMDB from '~/components/dialogs/SearchTMDB.vue';

import { Check, ChevronsUpDown, Search, Plus } from 'lucide-vue-next';

// * Utils
import { cn } from '@/lib/utils';

// * Types
import type { DBList, DBTitle } from '~~/types/list';
import type { TMDBTitleInSearch } from '~~/types/tmdb';


const $route = useRoute();


const lists = ref<Array<DBList>>([]);

const selectedList = ref<DBList>();


async function getLists() {
    const data = await $fetch<Array<DBList>>('/api/lists');

    if (data.length < 1) return;

    lists.value = data;

    selectList(data[0]!.id);
}


async function addNewList(name: string) {
    if (!name) return;

    const data = await $fetch<DBList>('/api/lists', {
        body: {
            name
        },
        method: 'POST'
    });

    if (!data?.id) return;

    lists.value.push(data);
}

async function addTitles(titles: Array<TMDBTitleInSearch>) {
    if (titles.length < 1) return;

    for (const title of titles) {
        const data = await $fetch<DBTitle>(`/api/lists/${selectedList.value?.id}/categories/${$route.params.categoryId}/titles`, {
            body: {
                data: title
            },
            method: 'POST'
        });

        if (!data?.id) continue;

        console.log(title)
    }
}

function selectList(listId: number) {
    const list = lists.value.find(l => l.id === listId);

    if (!list) return;

    selectedList.value = list;

    navigateTo(`/app/${listId}`);
}


onMounted(() => {
    getLists();
});


definePageMeta({
    middleware: ['auth']
});

</script>

<style lang="scss" scoped>

.page.app {
    width: 100%;
}

.header {
    display: flex;
    margin-bottom: 12px;
    width: 100%;
    align-items: center;
    gap: 8px;

    .add {
        cursor: pointer;
    }
}

</style>