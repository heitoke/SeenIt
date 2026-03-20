<template>
    <div class="list-titles">
        <div class="toolsbar" v-if="$d?.list?.category">
            <SearchTMDB v-if="categoryId !== 'likes' && $d.canEdit"
                :userId="$d?._id!"
                :listId="$d?.list?._id!"

                @save="async ($event) => {
                    $event.loading(true);

                    try {
                        const result = await addTitles($event.titles);

                        if (result) $event.close();
                    } catch (error) {
                        console.log(error)
                    }

                    $event.loading(false);
                }"

                v-slot="{ show }"
            >
                <Button class="add"
                    @click="show"
                >
                    <Search/>

                    <span style="white-space: nowrap;">{{ $t('searchTitle') }}</span>
                </Button>
            </SearchTMDB>

            <Input id="search" type="text" v-if="$route.params?.listId && $route.params?.categoryId"
                :placeholder="`${$t('search')}...`" class="pl-8"
                :value="$d?.list.category?.filters.text"

                style="width: 100%;"

                @input="onSearchInput($event.target.value)"
            />

            <Button variant="ghost" v-if="$d.canEdit && $d.list?.category?.titles.length > 0"
                @click="$d.list.category.toggleEditMode()"
            >
                <Pencil class="h-4 w-4" />
            </Button>

            <template v-if="$d.canEdit && $d.list?.category?.edit.enabled">
                <Popover style="padding: 4px; max-width: 215px;">
                    <template v-slot="{ toggle }">
                        <Button variant="secondary"
                            @click="toggle"
                        >
                            <EllipsisVertical/>

                            <span>{{ $t('action') }}</span>
                        </Button>
                    </template>

                    <template #content>
                        <Menu>
                            <MenuLabel>
                                <span>Selected: {{ $d.list?.category?.edit.selected.size }}</span>
                            </MenuLabel>

                            <MenuButton v-if="$d.list?.category?.edit.selected.size > 0"
                                @click="$d.list.category.edit.selected.clear()"
                            >
                                <span>{{ $t('clear') }}</span>
                            </MenuButton>

                            <MenuSeparator/>

                            <MenuChildren :disabled="!$d.list?.category?.edit.selected.size">
                                <template #default>
                                    <span>{{ $t('liked') }}</span>
                                </template>

                                <template #content>
                                    <MenuButton v-for="(_, i) of new Array(5)" :key="i"
                                        @click="$d.titles.like(i, ...$d.list?.category?.edit.selected || [])"
                                    >
                                        <Heart v-if="i > 0"/>
                                        <HeartOff v-else/>

                                        <span>{{ $t(i > 0 ? 'liked' : 'unliked') }} - {{ i }}</span>
                                    </MenuButton>
                                </template>
                            </MenuChildren>

                            <MenuChildren :disabled="!$d.list?.category?.edit.selected.size">
                                <template #default>
                                    <span>{{ $t('privateMode') }}</span>
                                </template>

                                <template #content>
                                    <MenuButton @click="$d.titles.privateMode(false, ...$d.list.category?.edit.selected || [])">
                                        <Eye/>
                                        <span>{{ $t('publicMode') }}</span>
                                    </MenuButton>
                                    <MenuButton @click="$d.titles.privateMode(true, ...$d.list.category?.edit.selected || [])">
                                        <EyeOff/>
                                        <span>{{ $t('privateMode') }}</span>
                                    </MenuButton>
                                </template>
                            </MenuChildren>

                            <MenuChildren :disabled="!$d.list?.category?.edit.selected.size">
                                <template #default>
                                    <span>{{ $t('moveTo') }}...</span>
                                </template>

                                <template #content>
                                    <MenuChildren v-for="list of $d.lists" :key="list._id">
                                        <template #default>
                                            <span>{{ list.name }}</span>
                                        </template>

                                        <template #content>
                                            <MenuButton v-for="category of list.categories" :key="category._id"
                                                @click="onMoveTitles(category._id)"
                                            >
                                                <span>{{ category.name }}</span>
                                            </MenuButton>
                                        </template>
                                    </MenuChildren>
                                </template>
                            </MenuChildren>

                            <MenuSeparator/>

                            <MenuButton :disabled="$d.list?.category?.edit.selected.size < 1"
                                @click="onDeleteTitles"
                            >
                                <Trash/>
                                <span>{{ $t('delete') }}</span>
                            </MenuButton>
                        </Menu>
                    </template>
                </Popover>
            </template>
        </div>

        <div class="grid-titles" v-if="listTitles?.length > 0">
            <TitleCard v-for="title of listTitles" :key="title._id"
                :title="(title as DashboardTitle)"
                :canEditHeart="$d.canEdit"
                :disableContextMenu="!$d.canEdit"
                :selected="$d.list?.category?.edit.enabled && $d.list.category.edit.selected.has(title._id)"
                :showParents="categoryId === 'likes'"

                @click="onClickTitle(title as DashboardTitle)"
            />
        </div>

        <Alert v-else>
            <template #picture>
                <Rocket class="h-4 w-4" />
            </template>
            
            <template #title>{{ $t('categoryEmpty.title') }}</template>
            <template #default>{{ $t('categoryEmpty.description') }}</template>
        </Alert>
    </div>
</template>

<script lang="ts" setup>

// * Components
import Alert from '~/components/ui/Alert.vue';
import SearchTMDB from '~/components/dialogs/SearchTMDB.vue';
import TitleCard from '~/components/modules/titles/Card.vue';

import { Search, Rocket, Pencil, EllipsisVertical, Trash, Heart, HeartOff, Eye, EyeOff } from 'lucide-vue-next';

// * Types
import type { TMDBTitleInSearch } from '~~/types/db/tmdbTitle';
import type { DashboardTitle } from '~/libs/dashboard';


const $route = useRoute();


const userId = String($route.params?.userId);
const categoryId = String($route.params?.categoryId);


const $dashboards = useDashboardsStore();


const $d = $dashboards.get(userId);



const page = ref<[number, number]>([20, 1]);


const listTitles = computed(() => {
    const [size, pageCount] = page.value;
    
    if (categoryId === 'likes') {
        return $d.list?.likedTitles.slice(0, pageCount * size) || [];
    }

    return $d.list?.category?.filterTitles.slice(0, pageCount * size) || [];
});



let timer: NodeJS.Timeout;


function onSearchInput(value: string) {
    clearTimeout(timer);

    if (!$d?.list?.category) return;

    timer = setTimeout(() => {
        $d.list!.category!.filters.text = value;
    }, 500);
}



async function addTitles(titles: Array<TMDBTitleInSearch>) {
    if (!titles.length || !$d?.list?.category?._id) return;

    return $d?.list?.category?.add(...titles);
}


function onClickTitle(title: DashboardTitle) {
    if (!$d.list || !$d.list?.category?.edit.enabled) return navigateTo(`/titles/${title._id}`);

    $d.list.category.edit.selected[$d.list.category.edit.selected.has(title._id) ? 'delete' : 'add'](title._id);
}

async function onDeleteTitles() {
    if (!$d.list) return;

    $d.titles.delete(...$d.list.category?.edit.selected || []);

    $d.list?.category?.edit.selected.clear();
}

async function onMoveTitles(categoryId: string) {
    if (!$d.list) return;

    $d.titles.move(categoryId, ...$d.list.category?.edit.selected || []);

    $d.list?.category?.edit.selected.clear();
}


function onScroll(event: Event) {
    if (!document.scrollingElement) return;

    const { scrollHeight, scrollTop } = document.scrollingElement!;

    if (window.innerHeight + scrollTop > scrollHeight - (window.innerHeight / 6)) {
        page.value[1]++;
    }
}



onMounted(() => {
    document.addEventListener('scroll', onScroll);

    $d?.list?.select(categoryId);
});

onUnmounted(() => {
    document.removeEventListener('scroll', onScroll);
});


definePageMeta({
    name: 'user-lists-category'
});


</script>

<style lang="scss" scoped>


.toolsbar {
    display: flex;
    padding: 8px 0;
    position: sticky;
    top: 0;
    left: 0px;
    align-items: center;
    background-color: var(--hx-background-primary);
    gap: 12px;
    z-index: 10;
}

.grid-titles {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    z-index: 2;
}


@media (max-width: 840px) {
    .grid-titles {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 640px) {
    .grid-titles {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 460px) {
    .toolsbar {
        // flex-direction: column;
        flex-wrap: wrap;

        button {
            &:nth-child(1) {
                order: 1;
            }

            &:nth-child(3) {
                order: 2;
            }

            &:nth-child(4) {
                order: 3;
            }
        }

        button + div {
            order: 4;
        }
    }

    .grid-titles {
        grid-template-columns: repeat(2, 1fr);
    }
}

</style>