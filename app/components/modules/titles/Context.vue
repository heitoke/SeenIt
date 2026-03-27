<template>
    <Popover :fixed="true" style="width: 215px;">
        <template v-slot="binds">
            <slot v-bind="binds"/>
        </template>

        <template #content>
            <Menu>
                <MenuButton @click="navigateTo(`/titles/${title._id}`)">
                    <Image/>

                    <span style="max-width: 85%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{ title?.tmdb?.title || title?.tmdb?.name }}</span>
                </MenuButton>

                <template v-if="!title.parentCategory?.parentList?.parentDashboard?.canEdit && user?._id">
                    <MenuSeparator/>

                    <TitleAdd v-if="!$d.titles.hasByTMDBId(title?.tmdb.id, title?.tmdb.mediaType)""
                        :title="tmdbSearch" v-slot="{ show }"
                    >
                        <MenuButton @click="show">
                            <ImagePlus/>

                            <span>Добавить к себе</span>
                        </MenuButton>
                    </TitleAdd>

                    <MenuButton v-else
                        @click="navigateTo(`/titles/${$d.titles.getTitleIdByTMDBId(title?.tmdb.id, title?.tmdb.mediaType)}`)"
                    >
                        <Image style="min-width: 16px;"/>

                        <div style="display: flex; flex-direction: column; align-items: start; max-width: 100%;">
                            <span style="max-width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{ title?.tmdb?.title || title?.tmdb?.name }}</span>
                            <span style="font-size: 10px; opacity: .5;">Ваше</span>
                        </div>
                    </MenuButton>
                </template>

                <template v-if="title.parentCategory?.parentList?.parentDashboard?.canEdit">
                    <MenuSeparator/>

                    <MenuChildren>
                        <template #default>
                            <Heart style="margin-right: 8px;"/>
                            <span>{{ $t('liked') }}</span>
                        </template>

                        <template #content>
                            <MenuButton v-for="(_, i) of new Array(5)" :key="i"
                                @click="title.like(i)"
                            >
                                <TitleHeart :size="14" :step="i" :disabled-tooltip="true"/>
                                
                                <span>{{ $t(i > 0 ? 'liked' : 'unliked') }} - {{ i }}</span>
                            </MenuButton>
                        </template>
                    </MenuChildren>

                    <MenuButton @click="title.privateMode(!title.private)">
                        <Eye v-if="title.private"/>
                        <EyeOff v-else/>

                        <span>{{ $t(title.private ? 'publicMode' : 'privateMode') }}</span>
                    </MenuButton>

                    <MenuChildren>
                        <template #default>
                            <SendToBack style="margin-right: 8px;"/>

                            <span>{{ $t('moveTo') }}...</span>
                        </template>

                        <template #content>
                            <MenuButton v-for="category of title.parentCategory?.parentList?.categories" :key="category._id"
                                @click="title.move(category._id)"
                            >
                                <span>{{ category.name }}</span>
                            </MenuButton>
                        </template>
                    </MenuChildren>

                    <MenuSeparator/>

                    <Dialog
                        :title="`${$t('delete')} ${title?.tmdb?.title || title.tmdb?.name }`"
                        :description="$t('confirmDelete.description')"
                    >
                        <template v-slot="{ show }">
                            <MenuButton @click="show">
                                <Trash/>

                                <span>{{ $t('delete') }}</span>
                            </MenuButton>
                        </template>
                        
                        <template v-slot:content="{ hide }">
                            <ButtonGroup>
                                <Button @click="hide">
                                    <span>{{ $t('cancel') }}</span>
                                </Button>

                                <Button variant="destructive" @click="hide(); title.delete()">
                                    <Trash/>
                                    <span>{{ $t('delete') }}</span>
                                </Button>
                            </ButtonGroup>
                        </template>
                    </Dialog>
                </template>
            </Menu>
        </template>
    </Popover>
</template>

<script lang="ts" setup>

// * Components
import TitleHeart from './badges/Like.vue';
import TitleAdd from '~/components/dialogs/titles/Add.vue';

// * Icons
import { Heart, Eye, EyeOff, SendToBack, Trash, Image, ImagePlus } from 'lucide-vue-next';

// * Types
import type { DashboardTitle } from '~/libs/dashboard';
import type { TMDBTitleInSearch } from '~~/types/db/tmdbTitle';


interface Props {
    title: DashboardTitle;
    disabled?: boolean;
}


const { user, d: $d } = useUserAuth();


const props = withDefaults(defineProps<Props>(), {
    disabled: false
});


const tmdbSearch = computed(() => {
    const {
        id,
        adult,
        backdrop_path,
        poster_path,
        name,
        title,
        original_name,
        original_title,
        overview,
        original_language,
        genres,
        popularity,
        vote_average,
        vote_count,
        origin_country,
        ...data
    } = props?.title?.tmdb;

    const isMovie = data.mediaType === 0;

    return {
        id,
        media_type: isMovie ? 'movie' : 'tv',
        adult,
        backdrop_path,
        poster_path,
        name,
        title,
        original_name,
        original_title,
        overview,
        original_language,
        genres,
        popularity,
        vote_average,
        vote_count,
        origin_country,
        first_air_date: isMovie ? '' : data.first_air_date,
        release_date: isMovie ? data.release_date : '',
        genre_ids: []
    } as TMDBTitleInSearch;
});

</script>