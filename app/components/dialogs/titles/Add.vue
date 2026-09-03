<template>
    <Dialog
        :title="title?.name || title?.title"
        :description="title?.overview"
        style="max-width: 512px;"
    >
        <template #default="binds">
            <slot v-bind="binds"/>
        </template>

        <template #title>
            <div class="title-images">
                <Image :src="getImageTMDB(title.poster_path)"/>

                <Image :src="getImageTMDB(title.backdrop_path)"/>
            </div>

            <h3 class="title-header">
                <span>{{ title?.name || title?.title }}</span>

                <span>{{ $t(title.media_type) }}</span>
            </h3>
        </template>

        <template #content="{ hide }">
            <div>
            </div>
        </template>

        <template #footer="{ show, hide }">
            <Button :disabled="true" variant="secondary">
                <Star :size="10" style="fill: yellow; stroke: yellow;"/>

                <span>{{ title?.vote_average.toFixed(1) }}/{{ title?.vote_count }}</span>
            </Button>

            <Button :disabled="true" variant="secondary">
                <Calendar :size="10"/>

                <span>{{ new Date(title?.release_date || title?.first_air_date).getFullYear() }}</span>
            </Button>

            <Popover side="top">
                <template #default="{ toggle, isOpened }">
                    <Button @click="toggle">
                        <Plus :size="12" v-if="!isOpened"/>
                        <ChevronDown v-else/>
                        <span>Добавить в список</span>
                    </Button>
                </template>

                <template #content="{ show }">
                    <div style="min-width: 169px;">
                        <Select :placeholder="$t('selectList')"
                            :options="$d.lists.map(list => ({
                                label: list.name,
                                value: list._id
                            }))"

                            @select="selectedList = String($event.value); show()"
                        />

                        <div style="margin: 8px 0;"></div>

                        <Select
                            :placeholder="$t('selectCategory')"
                            :disabled="!selectedList"
                            :options="$d.categories.filter(c => c.parentList?._id === selectedList).map(category => ({
                                label: category.name,
                                value: category._id
                            }))"

                            @select="selectedCategory = String($event.value); show()"
                        />

                        <div style="margin: 8px 0;"></div>
                        
                        <Button style="width: 100%;"
                            :disabled="!selectedList || !selectedCategory || !canAddInCategory"

                            @click="onClickAdd(title, hide)"
                        >
                            <Plus/>
                            <span>Добавить</span>
                        </Button>
                    </div>
                </template>
            </Popover>
        </template>
    </Dialog>
</template>

<script lang="ts" setup>

// * Components
import Image from '~/components/ui/Image.vue';

// * Icons
import { Plus, Star, Calendar, ChevronDown } from 'lucide-vue-next';

// * Types
import type { TMDBTitleInSearch } from '~~/types/db/tmdbTitle';


const { user, d: $d } = useUserAuth();


const props = defineProps<{
    title: TMDBTitleInSearch;
}>();


const selectedList = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);
const canAddInCategory = ref(true);




async function onClickAdd(tmdbTitle: TMDBTitleInSearch, hide: () => void) {
    if (!selectedList.value || !selectedCategory.value || !canAddInCategory.value) return;

    const category = $d.categories.get(selectedCategory.value);

    if (!category) return;

    if (category.parentList?._id !== selectedList.value) return;

    canAddInCategory.value = false;

    const result = await category.add(tmdbTitle);

    canAddInCategory.value = true;

    if (result) {
        hide();
    }
}

</script>

<style lang="scss" scoped>

.title-images {
    display: grid;
    position: relative;
    grid-template-columns: 30% calc(70% - 12px);
    gap: 12px;

    :deep(.ui-image) {
        width: 100%;
        height: 215px;
        border-radius: var(--hx-border-radius);
        box-sizing: border-box;
    }
}

.title-header {
    display: flex;
    margin-top: 12px;
    align-items: center;

    span:nth-child(2) {
        margin-left: 12px;
        padding: 0 6px;
        height: 20px;
        color: var(--hx-text-primary);
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        line-height: 20px;
        border-radius: var(--hx-border-radius);
        background-color: #00000045;
        box-sizing: border-box;
    }
}

</style>