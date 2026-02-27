<template>
    <div class="ui-menu-label">
        <slot/>
    </div>
</template>

<style lang="css" scoped>

.ui-menu-label {
    padding: 0 4px;
    width: 100%;
    min-height: 24px;
    color: var(--hx-background-primary);
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
}

::v-deep(svg.lucide) {
    margin-right: 4px;
    width: 16px;
    height: 16px;
}

</style>