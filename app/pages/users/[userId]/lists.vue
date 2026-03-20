<template>
    <div class="user-lists">
        <div class="sidebar">
            <div class="group">
                <Select style="width: 100%;"
                    :placeholder="$t('selectList')"
                    :options="$d.lists.map(list => ({
                        label: `${list.name} (${list.categories.reduce((a, b) => a + b.titles.length, 0)})`,
                        value: list._id
                    }))"
                    :value="$d.list?._id"

                    @select="selectList(String($event.value))"
                />


                <Popover v-if="$d.canEdit">
                    <template v-slot="{ toggle }">
                        <Button variant="secondary"
                            style="margin-left: 8px; width: 32px; min-height: 32px;"

                            @click="toggle"
                        >
                            <EllipsisVertical/>
                        </Button>
                    </template>

                    <template #content>
                        <Menu>
                            <template v-if="$d.list?._id">
                                <ListSettings
                                    :userId="$d._id"
                                    :listId="$d.list?._id"
                                    
                                    v-slot="{ show }"
                                >
                                    <MenuButton
                                        @click="show"
                                    >
                                        <Pencil/>
    
                                        <span>{{ $t('editList') }}</span>
                                    </MenuButton>
                                </ListSettings>
                                
                                <MenuSeparator/>
                            </template>

                            <NameField
                                :title="$t('createNewList')"

                                v-slot="{ show }"

                                @save="createNewList($event.name, $event.hide)"
                            >
                                <MenuButton
                                    @click="show"
                                >
                                    <Plus/>
                                    <span>{{ $t('createNewList') }}</span>
                                </MenuButton>
                            </NameField>
                        </Menu>
                    </template>
                </Popover>
            </div>

            <template v-if="$d.list !== null">
                <Button v-if="$d.list.likedTitles.length > 0"
                    variant="outline"
                    
                    @click="selectCategory('likes')"
                >
                    <Heart/>
                    <span>{{ $t('liked') }} ({{ $d.list.likedTitles.length }})</span>
                </Button>

                <Button v-for="category of $d.list?.categories" :key="category._id"
                    :variant="$d.list.category?._id === category._id ? 'default' : 'secondary'"

                    @click="selectCategory(category._id)"
                >
                    <div>
                        <div>{{ category.name }} ({{ category.titles.length }})</div>
                        
                        <div v-if="$d.list.category?.edit.enabled && category.titles.filter(title => $d.list?.category?.edit.selected.has(title._id)).length > 0"
                            style="font-size: 10px;"
                        >
                            {{ $t('selected') }} {{ category.titles.filter(title => $d.list?.category?.edit.selected.has(title._id)).length }}
                        </div>
                    </div>

                    <CategorySettings v-if="$d.canEdit"
                        :userId="$d?._id!"
                        :categoryId="category._id"

                        v-slot="{ show }"
                    >
                        <div style="position: absolute; right: 12px;"
                            @click.prevent.stop="show"
                        >
                            <Settings2/>
                        </div>
                    </CategorySettings>
                </Button>

                <NameField v-if="$d.canEdit"
                    :title="$t('createNewCategory')"
                    
                    v-slot="{ show }"
                    
                    @save="createNewCategory($event.name, $event.hide)"
                >
                    <Button variant="ghost"
                        @click="show"
                    >
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

import { EllipsisVertical, Check, ChevronsUpDown, Search, Plus, Heart, Settings2, UserRoundMinus } from 'lucide-vue-next';

// * Types
import type { User } from '~~/types/db/user';



const $route = useRoute();

const $userAuth = useUserAuth();


const $dashboards = useDashboardsStore();

const $d = $dashboards.get(String($route.params?.userId));


const a = ref([]);

function selectList(listId: string) {
    $d.select(listId);

    navigateTo({ name: 'user-lists-list', params: { listId } });
}

function selectCategory(categoryId: string) {
    if (!$d.list?._id) return;

    $d.list.select(categoryId === 'likes' ? null : categoryId);

    navigateTo({ name: 'user-lists-category', params: { listId: $d.list?._id, categoryId } });
}


async function createNewList(name: string, hide: () => void) {
    if (!name) return;
    
    const result = await $d.lists.create({ name });

    if (!result) return;

    hide();
}

async function createNewCategory(name: string, hide: () => void) {
    if (!name || !$d.list?._id) return;

    const result = await $d.categories.create($d.list._id, { name });

    if (!result) return;

    document.scrollingElement?.scroll({
        top: 0
    });

    hide();
}

function isString(str: string) {
    return !str || str.length < 1 || str.trim() === '';
}


watch(() => $route.params?.listId, newId => {
    $d.select(String(newId));
});

watch(() => $route.params?.categoryId, newId => {
    $d.list?.select(String(newId));
});



onMounted(async () => {
    const listId = String($route.params?.listId);
    const categoryId = String($route.params?.categoryId);

    if (isString(categoryId) && isString(listId)) {
        selectList(listId);
        selectCategory(categoryId)
    } else if (isString(listId)) {
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

    .group {
        display: flex;
        align-items: center;
    }
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