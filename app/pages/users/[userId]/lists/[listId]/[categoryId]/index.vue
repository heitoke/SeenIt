<template>
    <div class="list-titles">
        <div class="toolsbar" v-if="$cu.category">
            <SearchTMDB v-if="$cu.canEdit"
                :userId="$cu.userId"
                :listId="$cu.category.list?.id!"

                @save="async ($event) => {
                    $event.loading(true);

                    try {
                        const r = await addTitles($event.titles);

                        if (r) $event.close();
                    } catch (error) {
                        console.log(error)
                    }

                    $event.loading(false);
                }"
            >
                <Button class="add">
                    <Search/>

                    <span>{{ $t('searchTitle') }}</span>
                </Button>
            </SearchTMDB>

            <div class="relative w-full max-w items-center" v-if="$route.params?.listId && $route.params?.categoryId">
                <Input id="search" type="text" :placeholder="`${$t('search')}...`" class="pl-8"
                    :model-value="$cu.category!.filters.text"

                    @update:model-value="onSearchInput(String($event))"
                />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                    <Search class="size-4 text-muted-foreground" />
                </span>
            </div>

            <Toggle :model-value="$cu.list?.edit.enabled" v-if="$cu.canEdit"
                @click="$cu.list?.edit.toggle()"
            >
                <Pencil class="h-4 w-4" />
            </Toggle>

            <template v-if="$cu.canEdit && $cu.list?.edit.enabled">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline">
                            <EllipsisVertical/>
                            <span>{{ $t('action') }}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger :disabled="!$cu.list?.edit.selected.size">
                                    <span>{{ $t('liked') }}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem v-for="(_, i) of new Array(5)" :key="i"
                                            @click="$cu.likeTitles([...$cu.list!.edit.selected], i)"
                                        >
                                            <Heart v-if="i > 0"/>
                                            <HeartOff v-else/>
                                            <span>{{ $t(i > 0 ? 'liked' : 'unliked') }} - {{ i }}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger :disabled="!$cu.list?.edit.selected.size">
                                    <span>{{ $t('privateMode') }}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem @click="$cu.privateTitles([...$cu.list!.edit.selected], false)">
                                            <Eye/>
                                            <span>{{ $t('publicMode') }}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="$cu.privateTitles([...$cu.list!.edit.selected], true)">
                                            <EyeOff/>
                                            <span>{{ $t('privateMode') }}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger :disabled="!$cu.list?.edit.selected.size">
                                    <span>{{ $t('moveTo') }}...</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuSub v-for="list of $cu.lists" :key="list.id">
                                            <DropdownMenuSubTrigger>
                                                <span>{{ list.name }}</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuItem v-for="category of list.categories" :key="category.id"
                                                        @click="onMoveTitles(category.id)"
                                                    >
                                                        <span>{{ category.name }}</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem :disabled="$cu.list?.edit.selected.size < 1"
                            @click="onDeleteTitles"
                        >
                            <Trash/>
                            <span>{{ $t('delete') }}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </template>
        </div>

        <div class="grid-titles" v-if="$cu?.category?.titles?.length! > 0">
            <TitleCard v-for="title of $cu.category?.filters.titles" :key="title.id" :title="title"
                :selected="$cu.list?.edit.enabled && $cu.list?.edit.selected.has(title.id)"
                :canEditHeart="$cu.canEdit"
                :disableContextMenu="!$cu.canEdit"
                
                @click="onClickTitle(title as any)"
            />
        </div>

        <Alert v-else>
            <Rocket class="h-4 w-4" />
            <AlertTitle>{{ $t('categoryEmpty.title') }}</AlertTitle>
            <AlertDescription>{{ $t('categoryEmpty.description') }}</AlertDescription>
        </Alert>
    </div>
</template>

<script lang="ts" setup>

// * Components
import SearchTMDB from '~/components/dialogs/SearchTMDB.vue';
import TitleCard from '~/components/modules/titles/Card.vue';

import { Search, Rocket, Pencil, EllipsisVertical, Trash, Heart, HeartOff, Eye, EyeOff } from 'lucide-vue-next';

// * Stores
import { useCacheUsersStore } from '~/stores/cacheUsers';

// * Types
import type { User } from '~~/types/user';
import type { Title } from '~~/types/list';
import type { TMDBTitleInSearch } from '~~/types/tmdb';


const $route = useRoute();


const userId = Number($route.params?.userId);
const categoryId = Number($route.params?.categoryId);


const $cacheUsers = useCacheUsersStore();


const $cu = $cacheUsers.get(userId);


let timer: NodeJS.Timeout;


function onSearchInput(value: string) {
    clearTimeout(timer);

    if (!$cu.category) return;

    timer = setTimeout(() => {
        $cu.category!.filters.text = value;
    }, 500);
}



async function addTitles(titles: Array<TMDBTitleInSearch>) {
    if (!titles.length || !$cu.category?.id) return;

    return $cu.addTitles(titles, $cu.category?.id);
}


function onClickTitle(title: Title) {
    if (!$cu.list || !$cu.list?.edit.enabled) return navigateTo(`/titles/${title.id}`);

    $cu.list.edit.selected[$cu.list.edit.selected.has(title.id) ? 'delete' : 'add'](title.id);
}

async function onDeleteTitles() {
    if (!$cu.list) return;

    $cu.delete('title', ...$cu.list.edit.selected);

    $cu.list!.edit.selected.clear();
}

async function onMoveTitles(categoryId: number) {
    if (!$cu.list) return;

    $cu.moveTitles([...$cu.list.edit.selected], categoryId);

    $cu.list!.edit.selected.clear();
}



onMounted(() => {
    if (isNaN(categoryId)) return;

    $cu.select('category', categoryId);
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
    background-color: var(--background);
    gap: 12px;
    z-index: 10;
}

.grid-titles {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    z-index: 2;
}


.fade-enter-active,
.fade-leave-active {
    transition: all .2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
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