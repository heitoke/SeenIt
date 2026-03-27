<template>
    <div :class="['ui-carousel', { inset, infinite }]"
        :style="{ '--gap': gap + 'px' }"
    >
        <div class="carousel-button prev" v-show="groups.length > 1 && (infinite ? true : slideIndex > 0)"
            @click.stop.prevent="setSlide(slideIndex - 1)"
        >
            <ChevronLeft :size="18"/>
        </div>

        <div class="carousel-slides" :style="{ transform: `translateX(calc((${slideIndex} * -100%) - ${gap * slideIndex}px))` }">
            <div v-for="(groupItems, groupIndex) of groups" :key="groupIndex"
                class="carousel-slide-group"
            >
                <template v-for="(item, index) in groupItems" :key="index">
                    <div class="carousel-slide">
                        <slot name="item" v-bind="{ item, index: (groupIndex * props.step) + index, groupIndex, itemIndexInGroup: index }"></slot>
                    </div>
                </template>
            </div>
        </div>

        <div class="carousel-button next" v-show="groups.length > 1 && (infinite ? true : (slideIndex < groups.length - 1))"
            @click.stop.prevent="setSlide(slideIndex + 1)"
        >
            <ChevronRight :size="18"/>
        </div>
    </div>
</template>

<script lang="ts" setup generic="T">

// * Components
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';


const props = withDefaults(defineProps<{
    items: Array<T>;
    inset?: boolean;
    step?: number;
    infinite?: boolean;
    gap?: number;
}>(), {
    inset: false,
    step: 1,
    infinite: true,
    gap: 0
});


const slideIndex = ref(0);

const groups = computed(() => {
    const list = [];

    if (props.items?.length > 0) {
        for (let i = 0; i < props.items?.length; i += props.step) {
            list.push(props.items.slice(i, i + props.step));
        }
    }

    return list;
});


function setSlide(index: number) {
    const max = groups.value.length - 1;

    if (index < 0) {
        slideIndex.value = max;
    } else if (index > max) {
        slideIndex.value = 0;
    } else {
        slideIndex.value = index;
    }
}

</script>

<style lang="scss" scoped>

div.ui-carousel {
    position: relative;

    &:hover {
        .carousel-button {
            opacity: 1;
        }
    }

    &.inset {
        .carousel-button {
            &.prev {
                transform: translateX(calc(-100% - 12px));
            }

            &.next {
                transform: translateX(calc(100% + 12px));
            }
        }
    }

    .carousel-slides {
        display: flex;
        max-width: 100%;
        position: relative;
        align-items: center;
        box-sizing: border-box;
        transition: .2s;
        gap: var(--gap);
        z-index: 1;

        .carousel-slide-group {
            display: grid;
            width: 100%;
            min-width: 100%;
            position: relative;
            align-items: center;
            box-sizing: border-box;
            grid-template-columns: repeat(v-bind('step'), 1fr);
            transition: .2s;
            gap: var(--gap);
            z-index: 1;
            flex: 1;

            .carousel-slide {
                max-width: 100%;
                box-sizing: border-box;
                flex: 1;
            }
        }

    }

    .carousel-button {
        cursor: pointer;
        display: flex;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 50%;
        color: var(--hx-text-primary);
        border-radius: 50%;
        border: 1px dashed var(--hx-background-transparent);
        align-items: center;
        justify-content: center;
        background: #00000055;
        backdrop-filter: blur(5px);
        transition: all .2s, transform 0s;
        user-select: none;
        opacity: .3;
        z-index: 2;

        &:hover {
            border-style: solid;
        }

        &:active {
            box-shadow: 0 0 0 4px var(--hx-background-transparent);
            transform: scale(.9);
        }
    
        &.prev {
            left: 8px;
            
            :deep(svg) {
                transform: translateX(-1px);
            }
        }
    
        &.next {
            right: 8px;

            :deep(svg) {
                transform: translateX(1px);
            }
        }
    }
}

</style>