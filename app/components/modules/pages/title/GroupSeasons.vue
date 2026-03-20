<template>
    <div class="group-seasons" v-if="data.mediaType === 1">
        <h2>Сезоны ({{ data.seasons.length }})</h2>

        <Carousel class="seasons" :inset="true" :items="data.seasons" :step="6" :gap="12">
            <template #item="{ item: season, index }">
                <div @click="selectSeason(index)">
                    <div class="image">
                        <Image
                            :src="season?.poster_path ? `${$config.public.tmdbImageUrl}/t/p/original${season?.poster_path}` : null"
                            alt="Season Poster"
                        />
                    </div>

                    <div class="name">{{ season.name }}</div>

                    <ul>
                        <li>
                            <Timer :size="10"/>

                            <span>{{ season.episode_count }}</span>
                        </li>

                        <li>
                            <Calendar :size="10"/>

                            <span>{{ new Date(season.air_date).getFullYear() }}</span>
                        </li>
                    </ul>
                </div>
            </template>
        </Carousel>

        <AnimationHeight :showed="selectedSeason > -1 && season !== null">
            <div @click="selectedSeason = -1" style="margin-top: 12px;">
                <h2>Эпизоды ({{ season?.episodes.length }})</h2>

                <Carousel class="episodes" :inset="true" :items="season!.episodes" :step="4" :gap="12">
                    <template #item="{ item: episode, index }">
                        <div @click="selectSeason(index)">
                            <div class="image">
                                <Image
                                    :src="getImageTMDB(episode?.still_path)"
                                    alt="Season Poster"
                                />
                            </div>

                            <div class="name">{{ episode.name }}</div>

                            <ul>
                                <li>
                                    <Timer :size="10"/>

                                    <span>{{ runtimeToHM(episode.runtime) }}</span>
                                </li>

                                <li>
                                    <Star :size="10" style="fill: yellow; stroke: yellow;"/>

                                    <span>{{ episode?.vote_average.toFixed(1) }}/{{ episode?.vote_count }}</span>
                                </li>

                                <li>
                                    <Calendar :size="10"/>

                                    <span>{{ new Date(episode.air_date).toDateString() }}</span>
                                </li>
                            </ul>
                        </div>
                    </template>
                </Carousel>
            </div>
        </AnimationHeight>
    </div>
</template>

<script lang="ts" setup>

// * Components
import Image from '~/components/ui/Image.vue';
import Carousel from '~/components/ui/Carousel.vue';
import { Star, Timer, Calendar } from 'lucide-vue-next';

// * Types
import type { DashboardTitle } from '~/libs/dashboard';
import type { Season } from '~~/types/db/tmdbTitle';


const $config = useRuntimeConfig();


const props = defineProps<{
    title: DashboardTitle;
}>();


const selectedSeason = ref<number>(-1);
const season = ref<Season | null>(null);
    
const seasons = new Map<number, Season>();


const data = computed(() => props.title?.tmdb);

async function fetchTitleSeason(seasonNumber: number) {
    const data = await $fetch(`/api/titles/${props.title._id}/seasons/${seasonNumber}`);

    if (!data) return null;

    return data;
}

async function selectSeason(seasonNumber: number) {
    selectedSeason.value = seasonNumber;

    if (seasonNumber < 0) {
        season.value = null;
        return;
    }

    if (seasons.has(seasonNumber)) {
        return season.value = seasons.get(seasonNumber)!;
    }

    const seasonData = await fetchTitleSeason(seasonNumber);

    if (!seasonData) return;

    seasons.set(seasonNumber, seasonData);

    season.value = seasonData;
}

</script>

<style lang="scss" scoped>

.group-seasons {
    margin-top: 24px;

    h2 {
        margin-bottom: 12px;
        font-size: 24px;
        font-weight: 600;
    }

    :deep(.seasons) {
        .carousel-slide {
            cursor: pointer;
            position: relative;
            
            .image {
                width: 100%;
                position: relative;
                padding-bottom: 157%;
                border-radius: var(--hx-border-radius);
                overflow: hidden;
                transition: .2s;

                .ui-image {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    object-fit: cover;
                    object-position: center;
                    z-index: 1;
                }
            }

            .name {
                margin-top: 4px;
                font-size: 14px;
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
                    border-radius: var(--hx-border-radius);
                    align-items: center;
                    background-color: var(--hx-background-secondary);

                    span {
                        margin-left: 4px;
                    }
                }
            }
        }
    }

    :deep(.episodes) {
        .carousel-slide {
            cursor: pointer;
            padding: 12px;
            position: relative;
            border: 1px dashed var(--hx-background-transparent);
            border-radius: var(--hx-border-radius);
            
            .image {
                width: 100%;
                position: relative;
                padding-bottom: 196px;
                border-radius: var(--hx-border-radius);
                overflow: hidden;
                transition: .2s;

                .ui-image {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    object-fit: cover;
                    object-position: center;
                    z-index: 1;
                }
            }

            .name {
                margin-top: 4px;
                font-size: 13px;
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
                    border-radius: var(--hx-border-radius);
                    align-items: center;
                    background-color: var(--hx-background-secondary);

                    span {
                        margin-left: 4px;
                    }
                }
            }
        }
    }
}


</style>