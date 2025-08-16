<template>
    <div class="user-lists">
        <div class="sidebar">
            <Combobox by="label"
                :model-value="$cu.list"
                @update:model-value="selectList(Number($event))"
            >
                <ComboboxAnchor as-child>
                    <ComboboxTrigger as-child>
                        <Button variant="outline" class="justify-between" style="width: 100%;">
                            {{ $cu.list?.name ? `${$cu.list?.name} (${$cu.list.categories.flatMap(c => c.titles).length})` : $t('selectList') }}

                            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </ComboboxTrigger>
                </ComboboxAnchor>

                <ComboboxList>
                    <div class="relative w-full max-w-sm items-center">
                        <ComboboxInput class="focus-visible:ring-0 border-0 border-b rounded-none h-10" :placeholder="`${$t('selectList')}...`" />
                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                            <Search class="size-4 text-muted-foreground" />
                        </span>
                    </div>

                    <ComboboxEmpty>
                        No list found.
                    </ComboboxEmpty>

                    <ComboboxGroup>
                        <ComboboxItem class="flex items-center gap-2"
                            v-for="list in $cu.lists"
                            :key="list.id"
                            :value="list.id"
                        >
                            <div class="flex-1">
                                <span class="whitespace-nowrap text-ellipsis overflow-hidden">{{ list.name }} ({{ list.categories.flatMap(c => c.titles).length }})</span>
                            </div>
                            
                            <ListSettings :userId="$cu.user?.id!" :listId="list.id" v-if="$cu.canEdit">
                                <div @click.prevent.stop="" class="cursor-pointer opacity-70 hover:opacity-100">
                                    <Settings2/>
                                </div>
                            </ListSettings>

                            <ComboboxItemIndicator v-if="$cu.list?.id === list.id">
                                <Check :class="cn('ml-auto h-4 w-4')" />
                            </ComboboxItemIndicator>
                        </ComboboxItem>

                        <NameField v-if="$cu.canEdit"
                            :title="$t('createNewList')"
                            @save="createNewList($event.name)"
                        >
                            <Button style="margin-top: 8px; width: 100%;">
                                <Plus/>

                                <span>{{ $t('createNewList') }}</span>
                            </Button>
                        </NameField>
                    </ComboboxGroup>
                </ComboboxList>
            </Combobox>

            <template v-if="$cu.list?.id">
                <Button variant="outline"
                    @click="selectCategory(0)"
                >
                    <Heart/>
                    <span>{{ $t('liked') }} ({{ $cu.get('category', 0)?.titles?.length }})</span>
                </Button>

                <Button v-for="category of $cu.list?.categories" :key="category.id"
                    :variant="$cu.category?.id === category.id ? 'default' : 'secondary'"

                    @click="selectCategory(category.id)"
                >
                    <div>
                        <div>{{ category.name }} ({{ category.titles.length }})</div>
                        <div style="font-size: 10px;" v-if="$cu.list.edit.enabled && category.titles.filter(t => $cu.list!.edit.selected.has(t.id)).length > 0">
                            {{ $t('selected') }} {{ category.titles.filter(t => $cu.list!.edit.selected.has(t.id)).length }}
                        </div>
                    </div>

                    <CategorySettings :userId="$cu.user?.id!" :categoryId="category.id" v-if="$cu.canEdit">
                        <div class="icon absolute right-2 opacity-50 hover:opacity-100"
                            @click.prevent.stop=""
                        ><Settings2/></div>
                    </CategorySettings>
                </Button>

                <NameField :title="$t('createNewCategory')" v-if="$cu.canEdit"
                    @save="createNewCategory($event.name)"
                >
                    <Button variant="ghost">
                        <Plus/>
                        <span>{{ $t('createNewCategory') }}</span>
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
import ListSettings from '~/components/dialogs/lists/Settings.vue';
import CategorySettings from '~/components/dialogs/categories/Settings.vue';

import { Check, ChevronsUpDown, Search, Plus, Heart, Settings2, UserRoundMinus } from 'lucide-vue-next';

// * Stores
import { useCacheUsersStore } from '~/stores/cacheUsers';

// * Libs
import { cn } from '~/lib/utils';

// * Types
import type { User } from '~~/types/user';



const $route = useRoute();

const $user = useSupabaseUser();

const $cacheUsers = useCacheUsersStore();


const $cu = $cacheUsers.get(Number($route.params?.userId));


function selectList(listId: number) {
    $cu.select('list', listId);

    navigateTo({ name: 'user-lists-list', params: { listId } });
}

function selectCategory(categoryId: number) {
    $cu.select('category', categoryId);

    navigateTo({ name: 'user-lists-category', params: { listId: $cu.list?.id, categoryId } });
}


async function createNewList(name: string) {
    if (!name) return;

    $cu.createList(name);
}

async function createNewCategory(name: string) {
    if (!name || !$cu.list?.id) return;

    $cu.createCategory($cu.list?.id, name);
    document.scrollingElement?.scroll({
        top: 0
    })
}




watch(() => $route.params?.listId, newId => {
    $cu.select('list', Number(newId));
});

watch(() => $route.params?.categoryId, newId => {
    $cu.select('category', Number(newId));
});



onMounted(async () => {
    const listId = Number($route.params?.listId);
    const categoryId = Number($route.params?.categoryId);

    if (!isNaN(categoryId) && !isNaN(listId)) {
        selectList(listId);
        selectCategory(categoryId)
    } else if (!isNaN(listId)) {
        selectList(listId);
    }
});


definePageMeta({
    name: 'user-lists',
    alias: [
        '/u/:userId/lists'
    ]
});

</script>

<style lang="scss" scoped>

.user-lists:not(.error) {
    display: grid;
    width: 100%;
    align-items: start;
    grid-template-columns: 215px 1fr;
    gap: 12px;
}


.sidebar {
    display: flex;
    padding-top: 8px;
    position: sticky;
    top: 0px;
    left: 0px;
    flex-direction: column;
    gap: 8px;
}

@media (max-width: 640px) {
    .user-lists:not(.error) {
        display: flex;
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        position: relative;
    }

    main {
        width: 100%;
    }
}

</style>