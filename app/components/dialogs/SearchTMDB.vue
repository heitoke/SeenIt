<template>
    <Dialog
        :title="$t('search') + ' TMDB'"
        :description="$t('searchTmdb.description')"

        style="max-width: 415px;"
    >
        <template v-slot="{ show, hide }">
            <slot :show="show" :hide="hide"/>
        </template>

        <template v-slot:content="{ hide }">
            <div>
                <Group>
                    <Select placeholder="Выбрать тип" style="min-width: 169px;"
                        :options="[
                            { label: `${$t('movie')} & ${$t('tv')}`, value: 'multi' },
                            { label: $t('movie'), value: 'movie' },
                            { label: $t('tv'), value: 'tv' }
                        ]"
                        :value="'multi'"
    
                        @select="type = ($event.value as Type)"
                    />
    
                    <Input placeholder="Название" style="width: 100%;"
                        @input="onInput($event as any)"
                    />
                </Group>
    
                <ul class="titles" v-if="listTitles.length > 0 && !loadingTitles">
                    <Card v-for="title of listTitles" :key="title.id"
                        :class="{ disabled: ignoreTitleIds.includes(title.id) }"
                        :title="title"
                        :selected="selectedTitles.has(title.id)"
    
                        @click="selectTitle(title)"
                    />
                </ul>

                <Alert style="margin-top: 8px;" v-if="loadingTitles">
                    <template #picture>
                        <Loader2 class="animation-spin"/>
                    </template>
                    
                    <template #title>{{ $t('pleaseWait') }}</template>
                </Alert>
            </div>
        </template>

        <template v-slot:footer="{ hide }">
            <Popover side="top" v-if="selectedTitles.size > 1">
                <template v-slot="{ toggle }">
                    <Button @click="toggle">
                        <ChevronUp/>

                        <span>{{ $t('selected') }} <b>{{ selectedTitles.size }}</b></span>
                    </Button>
                </template>
                <template #content :side="'top'" style="min-width: clamp(320px, 50vw, 440px);">
                    <ul class="titles">
                        <Dialog v-for="[id, title] of selectedTitles" :key="title.id"
                            :title="`${$t('delete')} ${title?.title || title?.name}`"
                            :description="$t('confirmDelete.description')"
                        >
                            <template v-slot="{ show: showTitleDialogRemove }">
                                <Card :title="title" :selected="true" @click="showTitleDialogRemove"/>
                            </template>

                            <template #content>
                                <Card :title="title" style="padding: 0;"/>
                            </template>
                            
                            <template #footer="{ hide }">
                                <Button variant="secondary" @click="hide()">{{ $t('cancel') }}</Button>
                                <Button variant="destructive" @click="selectedTitles.delete(id); hide();">{{ $t('delete') }}</Button>
                            </template>
                        </Dialog>
                    </ul>
                </template>
            </Popover>

            <Button :disabled="selectedTitles.size < 1 || loading"
                @click="$emit('save', {
                    titles: [...selectedTitles.values()],
                    close: () => {
                        hide();

                        titles[type] = { text: '', list: [] };
                        selectedTitles.clear();
                    },
                    loading: (bool: boolean) => loading = bool
                })"
            >
                <template v-if="loading">
                    <Loader2 class="animation-spin" />
                    {{ $t('pleaseWait') }}...
                </template>
                <template v-else>
                    <Plus/>
                    <span>{{ $t('addTitles') }}</span>
                </template>
            </Button>
        </template>
    </Dialog>
</template>

<script lang="ts" setup>

import Card from './searchTMDB/Card.vue';

import { Plus, Loader2, ChevronUp } from 'lucide-vue-next';

// * Types
import type { TMDBTitleInSearch } from '~~/types/db/tmdbTitle';


interface EmitSave {
    titles: Array<TMDBTitleInSearch>;
    loading(bool: boolean): void;
    close(): void;
}

type Type = 'multi' | 'movie' | 'tv';


defineEmits({
    save(data: EmitSave) {
        return data;
    }
});


const props = defineProps<{
    userId: string;
    listId: string;
}>();


const $dashboards = useDashboardsStore();

const $d = $dashboards.get(props.userId);


const open = ref(false);
const loading = ref(false);
const loadingTitles = ref(false);
const type = ref<Type>('multi');


const titles = ref<Record<Type, { text: string, list: Array<TMDBTitleInSearch> }>>({
    multi: { text: '', list: [] },
    movie: { text: '', list: [] },
    tv: { text: '', list: [] }
});
const selectedTitles = ref<Map<number, TMDBTitleInSearch>>(new Map());


const ignoreTitleIds = computed(() => {
    const list = $d.lists.get(props.listId);

    if (!list) return [];

    return list.categories.reduce((a, b) => ([ ...a, ...b.titles.map(t => t.tmdb.id) ]), [] as Array<number>);
});

const listTitles = computed(() => titles.value[type.value].list);


async function searchTitles(text: string = '') {
    loadingTitles.value = true;

    const data = await $fetch('/api/tmdb/search', {
        query: {
            type: type.value,
            text,
            lang: 'ru-RU'
        }
    });

    loadingTitles.value = false;

    titles.value[type.value].list = data.results.filter(t => t?.media_type === 'movie' || t?.media_type === 'tv');
}


let timer: NodeJS.Timeout;

function onInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement)!.value;

    clearTimeout(timer);

    if (!value || value.trim() === '') return;

    titles.value[type.value].text = value;
    
    timer = setTimeout(() => searchTitles(value), 500);
}

function selectTitle(title: TMDBTitleInSearch) {
    if (ignoreTitleIds.value.includes(title.id)) return;

    if (selectedTitles.value.has(title.id)) {
        selectedTitles.value.delete(title.id);
    } else {
        selectedTitles.value.set(title.id, title);
    }
}

</script>

<style lang="scss" scoped>

.group {
    display: flex;
    margin: 12px 0;
    max-width: 415px;
    align-items: center;
    gap: 12px;
}

ul.titles {
    max-height: 50vh;
    overflow-x: hidden;

    .title {
        &:not(:last-child) {
            margin-bottom: 4px;
        }
    }
}

</style>