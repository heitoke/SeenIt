<template>
    <Transition name="fade">
        <img class="ui-image" :src="src" :alt="alt" v-show="mode === 'ready'"
            @load="onImageLoad"
            @error="onImageError"
        >
    </Transition>

    <div :class="['ui-image', mode]" v-show="mode !== 'ready'">
        <div></div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
    src: string;
    alt?: string;
}>();


const mode = ref<'ready' | 'error' | 'loading'>('loading');


function renderImage() {

}


function onImageLoad() {
    mode.value = 'ready';
}

function onImageError() {
    mode.value = 'error';
}

</script>

<style lang="scss" scoped>

img.ui-image {
    object-fit: cover;
    object-position: center;
    transition: opacity .2s;
}

div.ui-image {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    background-color: var(--accent);

    div {
        width: 50%;
        padding-bottom: 50%;
        mask-image: url('~/assets/images/logo-dark.png');
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: 125%;
    }

    &.loading div {
        background-color: var(--primary-foreground);
        
        &:before {
            content: '';
            display: block;
            width: 0;
            height: 100%;
            position: absolute;
            top: 5%;
            box-shadow: 0 2px 15px 9px rgba(255,255,255,0.4);
            animation: shades 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
            transform: skewX(-20deg);
            z-index: 5;
        }
    }

    &.error div {
        background-color: red;
    }
}


@keyframes shades {
    0% { left: 0%; opacity: 0; }
    50% { opacity: 1; }
    100% { left: 100%; opacity: 0; }
}


.fade-enter-active,
.fade-leave-active {
    transition: opacity .7s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

</style>