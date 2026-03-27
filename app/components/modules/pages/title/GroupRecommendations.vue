<template>
    <div class="group-recommendations">
        <h2>Рекомендации</h2>

        <p>Данные рекомендации на основе базы данных TMDB</p>

        <Carousel class="recommendations" v-if="list.length > 0"
            :inset="true" :items="list" :step="6" :gap="12"
        >
            <template #item="{ item: title, index }">
                <NuxtLink v-if="$d.titles.hasByTMDBId(title.id, title.media_type === 'movie' ? 0 : 1)"
                    :to="`/titles/${$d.titles.getTitleIdByTMDBId(title.id, title.media_type === 'movie' ? 0 : 1)}`"
                >
                    <TitleCard
                        :title="$d.titles.getByTMDBId(title.id)!"
                        :canEditHeart="false"
                        :disableContextMenu="true"
                        :showParents="true"
                    />
                </NuxtLink>

                <TitleAdd v-slot="{ show }" v-else
                    :title="title"
                >
                    <div @click="show">
                        <div class="image">
                            <div class="media">
                                <span>{{ $t(title.media_type) }}</span>
                            </div>

                            <Image
                                :src="getImageTMDB(title?.poster_path)"
                                alt="Title Poster"
                            />
                        </div>

                        <div class="details">
                            <div class="name">{{ title?.name ?? title?.title }}</div>

                            <ul>
                                <li v-if="title?.vote_average > 0">
                                    <Star :size="10" color="yellow"/>
                                    <span>{{ title?.vote_average.toFixed(1) }}/{{ title?.vote_count }}</span>
                                </li>

                                <li>
                                    <Calendar :size="10"/>

                                    <span>{{ new Date(title?.release_date || title?.first_air_date).getFullYear() }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </TitleAdd>
            </template>
        </Carousel>
    </div>
</template>

<script lang="ts" setup>

// * Components
import TitleCard from '~/components/modules/titles/Card.vue';
import TitleAdd from '~/components/dialogs/titles/Add.vue';
import Image from '~/components/ui/Image.vue';
import Carousel from '~/components/ui/Carousel.vue';
import { Star, Calendar } from 'lucide-vue-next';

// * Types
import type { DashboardTitle } from '~/libs/dashboard';
import type { TMDBTitleInSearch } from '~~/types/db/tmdbTitle';


const { d: $d } = useUserAuth();


const props = defineProps<{
    title: DashboardTitle;
}>();


const list = ref<Array<TMDBTitleInSearch>>([]);



async function fetchTitleRecommendations(titleId: string) {
    const data = await $fetch(`/api/titles/${titleId}/recommendations`);

    if (!data) return;
    
    list.value = data;
}


onMounted(() => {
    fetchTitleRecommendations(props.title._id);
});

</script>

<style lang="scss" scoped>

.group-recommendations {
    margin-top: 24px;

    h2 {
        margin-bottom: 12px;
        font-size: 24px;
        font-weight: 600;
    }

    h2 + p {
        margin-bottom: 12px;
        font-size: 12px;
        opacity: .7;
    }

    :deep(.recommendations) {
        .carousel-slide {
            cursor: pointer;
            position: relative;
            border: 1px dashed var(--hx-background-transparent);
            border-radius: var(--hx-border-radius);
            box-sizing: border-box;
            transition: all .2s;
            user-select: none;
            overflow: hidden;

            &:hover,
            &.selected {
                .image {
                    .media,
                    .badges {
                        opacity: 1;
                    }
                }
                .details {
                    transform: translateY(1px);
                }
            }

            .image {
                width: 100%;
                position: relative;
                padding-bottom: 157%;
                overflow: hidden;
                transition: .2s;

                .media {
                    padding: 0 6px;
                    height: 20px;
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    line-height: 20px;
                    color: var(--hx-text-primary);
                    border-radius: var(--hx-border-radius);
                    background-color: #00000045;
                    backdrop-filter: blur(5px);
                    box-sizing: border-box;
                    transition: .2s;
                    opacity: .5;
                    z-index: 2;
                }

                .ui-image {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    object-fit: cover;
                    object-position: center;
                    z-index: 1;
                }
            }
            
            .details {
                display: flex;
                padding: 4px 8px;
                width: 100%;
                position: absolute;
                left: 0;
                bottom: 0;
                flex-direction: column;
                border-radius: var(--hx-border-radius);
                background-color: #00000095;
                backdrop-filter: blur(5px);
                box-sizing: border-box;
                transform: translateY(calc(100% - 24px));
                transition: .2s;
                z-index: 5;

                .name {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--hx-text-primary);
                    word-break: break-word;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .genres {
                    margin: 2px 0;
                    color: var(--hx-text-secondary);
                    font-size: 10px;
                }

                ul {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 2px;

                    li {
                        display: flex;
                        padding: 2px 4px;
                        color: var(--hx-text-secondary);
                        font-size: 10px;
                        border-radius: 25px;
                        align-items: center;
                        background-color: #00000045;

                        span {
                            margin-left: 4px;
                        }
                    }
                }
            }
        }
    }

}

</style>