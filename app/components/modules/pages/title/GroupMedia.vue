<template>
    <div class="group-media" v-if="Object.keys(media).length > 0">
        <h2>Медиа</h2>

        <ButtonGroup style="margin: 12px 0; justify-content: start;">
            <Button v-for="(value, key) in media" :key="key"
                :variant="selectedMedia === key ? 'default' : 'secondary'"

                @click="selectedMedia = key"
            >
                <ImageIcon :size="14"/>
                <span>{{ $t(key) }} ({{ value.length }})</span>
            </Button>
        </ButtonGroup>

        <Carousel :class="['media-images', selectedMedia]" v-if="selectedMedia !== 'videos'"
            :inset="true" :items="media[selectedMedia]" :step="6" :gap="12"
        >
            <template #item="{ item, index }">
                <Dialog>
                    <template v-slot:default="{ show }">
                        <div class="image" @click="show">
                            <Image
                                :src="getImageTMDB(item.file_path)"
                            />
                        </div>
                    </template>

                    <template #content="{ hide }">
                        <div>
                            <Image style="max-width: 90vw; max-height: 90vh;"
                                :src="getImageTMDB(item.file_path)"
                            />

                            <ButtonGroup>
                                <Button :disabled="true" variant="secondary">
                                    <ImageUpscale :size="10"/>

                                    <span>Size ({{ item.aspect_ratio }}): {{ item.width }}x{{ item.height }}</span>
                                </Button>

                                <Button :disabled="true" variant="secondary">
                                    <Star :size="10" style="fill: yellow; stroke: yellow;"/>

                                    <span>{{ item?.vote_average.toFixed(1) }}/{{ item?.vote_count }}</span>
                                </Button>

                                <Button @click="hide">
                                    <X :size="10"/>
                                    <span>{{ $t('close') }}</span>
                                </Button>
                            </ButtonGroup>

                            <div></div>
                        </div>
                    </template>
                </Dialog>

                <ul>
                    <li>
                        <Star :size="10" style="fill: yellow; stroke: yellow;"/>

                        <span>{{ item?.vote_average.toFixed(1) }}/{{ item?.vote_count }}</span>
                    </li>
                </ul>
            </template>
        </Carousel>

        <!-- <Carousel class="media-videos" v-if="selectedMedia === 'videos'"
            :inset="true" :items="media[selectedMedia]" :step="6" :gap="12"
        >
            <template #item="{ item, index }"
                @click="selectedSeason = index"
            >
                <div class="image" @click="selectedSeason = index">
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
            </template>
        </Carousel> -->
    </div>
</template>

<script lang="ts" setup>

// * Components
import Image from '~/components/ui/Image.vue';
import Carousel from '~/components/ui/Carousel.vue';
import { ImageUpscale, Star, X, Image as ImageIcon, Calendar } from 'lucide-vue-next';

// * Types
import type { DashboardTitle } from '~/libs/dashboard';


interface MediaImage {
    aspect_ratio: number;
    height: number;
    iso_3166_1: string;
    iso_639_1: string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
}

interface MediaVideo {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
}

interface Media {
    logos: Array<MediaImage>;
    posters: Array<MediaImage>;
    backdrops: Array<MediaImage>;
    videos: Array<MediaVideo>;
}


const props = defineProps<{
    title: DashboardTitle;
}>();


const media = ref<Media>({
    logos: [],
    posters: [],
    backdrops: [],
    videos: []
});

const selectedMedia = ref<keyof Media>('logos');


async function fetchTitleMedia(titleId: string) {
    const data = await $fetch<Media>(`/api/titles/${titleId}/media`);

    if (!data) return;

    media.value = {} as any;

    for (const key in data) {
        if (data[key as keyof Media]?.length < 1) continue;

        // @ts-ignore
        media.value[key as keyof Media] = data[key as keyof Media];
    }

    selectedMedia.value = Object.keys(media.value)[0] as keyof Media;
}

onMounted(() => {
    fetchTitleMedia(props.title._id);
});

</script>

<style lang="scss" scoped>

.group-media {
    margin-top: 24px;

    h2 {
        margin-bottom: 12px;
        font-size: 24px;
        font-weight: 600;
    }

    :deep(.media-images) {
        &.logos {
            .carousel-slide {
                .image {
                    padding-bottom: 100%;
                }
            }
        }
        
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
                margin-top: 4px;
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