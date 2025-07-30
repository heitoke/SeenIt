<template>
    <div class="list-titles">
        <div class="toolsbar">
            <SearchTMDB @save="addTitles($event)">
                <Button class="add">
                    <Search/>

                    <span>Search title</span>
                </Button>
            </SearchTMDB>

            <div class="relative w-full max-w items-center" v-if="$route.params?.listId && $route.params?.categoryId">
                <Input id="search" type="text" placeholder="Search..." class="pl-8" v-model="text"/>
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                    <Search class="size-4 text-muted-foreground" />
                </span>
            </div>

            <Toggle
                @click="$lists.toggleEditMode()"
            >
                <Pencil class="h-4 w-4" />
            </Toggle>

            <template v-if="$lists.selectedList?.editMode.enabled">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline">
                            <EllipsisVertical/>
                            <span>Action</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger :disabled="!$lists.selectedList?.editMode?.selected?.length">
                                    <span>Liked</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem @click="$lists.likeTitles($lists.selectedList.editMode.selected, true)">
                                            <Heart/>
                                            <span>Liked</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="$lists.likeTitles($lists.selectedList.editMode.selected, false)">
                                            <HeartOff/>
                                            <span>Unliked</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger :disabled="!$lists.selectedList?.editMode?.selected?.length">
                                    <span>Move to...</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuSub v-for="list of $lists.lists" :key="list.id">
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
                        <DropdownMenuItem :disabled="!$lists.selectedList?.editMode?.selected?.length"
                            @click="onDeleteTitles"
                        >
                            <Trash/>
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </template>
        </div>

        <div class="grid-titles" v-if="$lists?.selectedCategory?.titles?.length! > 0">
            <TitleCard v-for="title of listTitles" :key="title.id" :title="title"
                :selected="$lists.selectedList?.editMode?.enabled && $lists.selectedList?.editMode?.selected.includes(title.id)"
                
                @click="onClickTitle(title as any)"
            />
        </div>

        <Alert v-else>
            <Rocket class="h-4 w-4" />
            <AlertTitle>So far, it's empty</AlertTitle>
            <AlertDescription>Find what you want to add to the category...</AlertDescription>
        </Alert>
    </div>
</template>

<script lang="ts" setup>

// * Components
import SearchTMDB from '~/components/dialogs/SearchTMDB.vue';
import TitleCard from '~/components/TitleCard.vue';

import { Search, Rocket, Pencil, EllipsisVertical, Trash, Heart, HeartOff } from 'lucide-vue-next';

// * Stores
import { useListsStore } from '~/stores/lists';

// * Types
import type { Title } from '~~/types/list';
import type { TMDBTitleInSearch } from '~~/types/tmdb';


const $route = useRoute();


const $lists = useListsStore();


const text = ref('');

const listTitles = computed(() => {
    const regex = new RegExp(text.value, 'ig');

    return $lists.selectedCategory?.titles.filter(t => regex.test(t.data.name) || regex.test(t.data.title) || regex.test(t.data.original_name) || regex.test(t.data.original_title));
});



async function addTitles(titles: Array<TMDBTitleInSearch>) {
    if (!titles.length || !$lists.selectedCategory?.id) return;

    $lists.addTitles(titles, $lists.selectedCategory?.id);
}


function onClickTitle(title: Title) {
    console.log(title, $lists.selectedList?.editMode.enabled)
    if (!$lists.selectedList?.editMode?.enabled) return;

    const selected = $lists.selectedList?.editMode?.selected

    const titleIndex = selected?.indexOf(title.id);

    console.log(selected, titleIndex)

    if (titleIndex < 0) selected?.push(title.id);
    else selected?.splice(titleIndex, 1);

    console.log(selected)
}

async function onDeleteTitles() {
    $lists.deleteTitles($lists.selectedList?.editMode?.selected || []);

    $lists.selectedList!.editMode.selected = [];
}

async function onMoveTitles(categoryId: number) {
    $lists.moveTitles($lists.selectedList?.editMode?.selected || [], categoryId);

    $lists.selectedList!.editMode.selected = [];
}


</script>

<style lang="scss" scoped>

.toolsbar {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    gap: 12px;
}

.grid-titles {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
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