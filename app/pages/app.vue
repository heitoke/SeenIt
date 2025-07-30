<template>
    <div class="app">
        <div class="sidebar">
            <Combobox by="label"
                :model-value="$lists.selectedList"
                @update:model-value="selectList(Number($event))"
            >
                <ComboboxAnchor as-child>
                    <ComboboxTrigger as-child>
                        <Button variant="outline" class="justify-between" style="width: 100%;">
                            {{ $lists.selectedList?.name ?? 'Select list' }}

                            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </ComboboxTrigger>
                </ComboboxAnchor>

                <ComboboxList>
                    <div class="relative w-full max-w-sm items-center">
                        <ComboboxInput class="focus-visible:ring-0 border-0 border-b rounded-none h-10" placeholder="Select list..." />
                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                            <Search class="size-4 text-muted-foreground" />
                        </span>
                    </div>

                    <ComboboxEmpty>
                        No list found.
                    </ComboboxEmpty>

                    <ComboboxGroup>
                        <ComboboxItem
                            v-for="list in $lists.lists"
                            :key="list.id"
                            :value="list.id"
                        >
                            {{ list.name }}

                            <ComboboxItemIndicator v-if="$lists.selectedList?.id === list.id">
                                <Check :class="cn('ml-auto h-4 w-4')" />
                            </ComboboxItemIndicator>
                        </ComboboxItem>

                        <NameField
                            title="Create new list"
                            @save="createNewList($event.name)"
                        >
                            <Button style="margin-top: 8px; width: 100%;">
                                <Plus/>

                                <span>Create new list</span>
                            </Button>
                        </NameField>
                    </ComboboxGroup>
                </ComboboxList>
            </Combobox>

            <template v-if="$lists.selectedList?.id">
                <Button variant="outline"
                    @click="selectCategory(0)"
                >
                    <Heart/>
                    <span>Liked</span>
                </Button>

                <Button v-for="category of $lists.selectedList?.categories" :key="category.id"
                    :variant="$lists.selectedCategory?.id === category.id ? 'default' : 'secondary'"

                    @click="selectCategory(category.id)"
                >
                    <div>
                        <div>{{ category.name }}</div>
                    </div>
                </Button>

                <NameField title="Create new category"
                    @save="createNewCategory($event.name)"
                >
                    <Button variant="ghost">
                        <Plus/>
                        <span>Create new category</span>
                    </Button>
                </NameField>
            </template>            
        </div>

        <main>
            <NuxtPage/>
        </main>
    </div>
</template>

<script lang="ts" setup>

// * Components
import NameField from '~/components/dialogs/NameField.vue';

import { Check, ChevronsUpDown, Search, Plus, Heart } from 'lucide-vue-next';

// * Stores
import { useListsStore } from '~/stores/lists';

// *Libs
import { cn } from '~/lib/utils';


const $route = useRoute();


const $lists = useListsStore();


function selectList(listId: number) {
    navigateTo('/app/' + listId);
}

function selectCategory(categoryId: number) {
    $lists.selectLC('category', categoryId);

    navigateTo(`/app/${$lists.selectedList?.id}/${categoryId}`);
}


async function createNewList(name: string) {
    if (!name) return;

    $lists.createList(name);
}

async function createNewCategory(name: string) {
    if (!name || !$lists.selectedList?.id) return;

    $lists.createCategory($lists.selectedList?.id, name);
}




watch(() => $route.params?.listId, newId => {
    $lists.selectLC('list', Number(newId));
});

watch(() => $route.params?.categoryId, newId => {
    $lists.selectLC('category', Number(newId));
});



onMounted(() => {
    const listId = Number($route.params?.listId);
    const categoryId = Number($route.params?.categoryId);

    if (!isNaN(listId)) $lists.selectLC('list', listId);
    if (!isNaN(categoryId)) $lists.selectLC('category', categoryId);
});



definePageMeta({
    middleware: ['auth']
});

</script>

<style lang="scss" scoped>

.page.app {
    display: grid;
    width: 100%;
    grid-template-columns: 215px 1fr;
    gap: 12px;
}


.sidebar {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

@media (max-width: 640px) {
    .page.app {
        display: flex;
        flex-direction: column;
    }
}

</style>