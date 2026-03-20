<template>
    <div class="ui-alert">
        <div class="picture">
            <slot name="picture"/>
        </div>

        <div class="content">
            <div class="title">
                <slot name="title"/>
            </div>

            <div class="text">
                <slot/>
            </div>
        </div>

        <slot name="action"/>
    </div>
</template>

<script lang="ts" setup>

const $slots = defineSlots<{
    picture?(): any;
    title?(): any;
    default(): any;
    action?(): any;
}>();

</script>

<style lang="css" scoped>

.ui-alert {
    display: flex;
    padding: var(--hx-padding-xl);
    align-items: start;
    border-radius: var(--hx-border-radius);
    border: 1px solid var(--hx-background-transparent);
}

.ui-alert .picture ::v-deep(.lucide),
.ui-alert .picture ::v-deep(img) {
    margin-right: 8px;
}

.ui-alert .picture ::v-deep(.lucide) {
    margin-top: 1px;
    width: 14px;
    height: 14px;
}

.ui-alert .content {
    display: flex;
    flex-direction: column;
}

.ui-alert .content .title {
    margin-bottom: 2px;
    font-size: 14px;
    font-weight: 600;
}

.ui-alert .content .text {
    font-size: 12px;
    font-weight: 400;
    opacity: .8;
}

</style>