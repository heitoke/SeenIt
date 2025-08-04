<template>
    <div class="user-lists" v-if="mode === 'ready' && $cl?.userId">
        <div class="sidebar">
            <Combobox by="label"
                :model-value="$cl.list"
                @update:model-value="selectList(Number($event))"
            >
                <ComboboxAnchor as-child>
                    <ComboboxTrigger as-child>
                        <Button variant="outline" class="justify-between" style="width: 100%;">
                            {{ $cl.list?.name ?? $t('selectList') }}

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
                            v-for="list in $cl.lists"
                            :key="list.id"
                            :value="list.id"
                        >
                            <span class="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">{{ list.name }}</span>
                            
                            <ListSettings :userId="userId" :listId="list.id">
                                <div @click.prevent.stop="" class="cursor-pointer opacity-70 hover:opacity-100">
                                    <Settings2/>
                                </div>
                            </ListSettings>

                            <ComboboxItemIndicator v-if="$cl.list?.id === list.id">
                                <Check :class="cn('ml-auto h-4 w-4')" />
                            </ComboboxItemIndicator>
                        </ComboboxItem>

                        <NameField
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

            <template v-if="$cl.list?.id">
                <Button variant="outline"
                    @click="selectCategory(0)"
                >
                    <Heart/>
                    <span>{{ $t('liked') }} ({{ $cl.get('category', 0)?.titles?.length }})</span>
                </Button>

                <Button v-for="category of $cl.list?.categories" :key="category.id"
                    :variant="$cl.category?.id === category.id ? 'default' : 'secondary'"

                    @click="selectCategory(category.id)"
                >
                    <div>
                        <div>{{ category.name }} ({{ category.titles.length }})</div>
                        <div style="font-size: 10px;" v-if="$cl.list.edit.enabled && category.titles.filter(t => $cl.list!.edit.selected.has(t.id)).length > 0">
                            {{ $t('selected') }} {{ category.titles.filter(t => $cl.list!.edit.selected.has(t.id)).length }}
                        </div>
                    </div>

                    <CategorySettings :userId="userId" :categoryId="category.id">
                        <div class="icon absolute right-2 opacity-50 hover:opacity-100"
                            @click.prevent.stop=""
                        ><Settings2/></div>
                    </CategorySettings>
                </Button>

                <NameField :title="$t('createNewCategory')"
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

    <div class="user-lists" v-else-if="mode === 'none'"></div>

    <div class="user-lists error" v-else-if="mode === 'no_user'">
        <Alert>
            <UserRoundMinus class="h-4 w-4" />
            <AlertTitle>{{ $t('notFoundUser.title') }}</AlertTitle>
            <AlertDescription>{{ $t('notFoundUser.description') }}</AlertDescription>
        </Alert>
    </div>
</template>

<script lang="ts" setup>

// * Components
import NameField from '~/components/dialogs/NameField.vue';
import ListSettings from '~/components/dialogs/lists/Settings.vue';
import CategorySettings from '~/components/dialogs/categories/Settings.vue';

import { Check, ChevronsUpDown, Search, Plus, Heart, Settings2, UserRoundMinus } from 'lucide-vue-next';

// * Stores
import { useListsStore } from '~/stores/lists';

// *Libs
import { cn } from '~/lib/utils';


const $route = useRoute();

const $user = useSupabaseUser();

const $lists = useListsStore();


const mode = ref<'ready' | 'none' | 'no_user'>('none');


const userId = String($route.params?.userId);


const $cl = $lists.get(userId);


function selectList(listId: number) {
    $cl.select('list', listId);

    navigateTo({ name: 'user-lists-list', params: { listId } });
}

function selectCategory(categoryId: number) {
    $cl.select('category', categoryId);

    navigateTo({ name: 'user-lists-category', params: { listId: $cl.list?.id, categoryId } });
}


async function createNewList(name: string) {
    if (!name) return;

    $cl.createList(name);
}

async function createNewCategory(name: string) {
    if (!name || !$cl.list?.id) return;

    $cl.createCategory($cl.list?.id, name);
}




watch(() => $route.params?.listId, newId => {
    $cl.select('list', Number(newId));
});

watch(() => $route.params?.categoryId, newId => {
    $cl.select('category', Number(newId));
});



onMounted(async () => {
    const listId = Number($route.params?.listId);
    const categoryId = Number($route.params?.categoryId);

    if (!$cl.alreadyLoadData) await $cl.loadUserData();

    if (!isNaN(categoryId) && !isNaN(listId)) {
        selectList(listId);
        selectCategory(categoryId)
    } else if (!isNaN(listId)) {
        selectList(listId);
    }

    mode.value = 'ready';
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
    position: sticky;
    top: 8px;
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
}

</style>