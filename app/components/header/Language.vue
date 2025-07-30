<template>
    <div class="language">
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <div class="btn-lang">
                    <span>{{ locale }}</span>

                    <Languages :size="16"/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
                <DropdownMenuLabel>Languages</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup @update:model-value="setLocale($event as any)" :model-value="locale">
                    <DropdownMenuRadioItem v-for="locale in locales" :key="locale.code"
                        :value="locale.code"
                    >
                        {{ locale.name }}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>

<script lang="ts" setup>

import { Languages } from 'lucide-vue-next';


const { locales, locale, setLocale } = useI18n();

</script>

<style lang="scss" scoped>

.btn-lang {
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: .2s;
    opacity: .7;

    &:hover {
        opacity: 1;
    }

    span {
        margin-right: 4px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
    }
}

</style>