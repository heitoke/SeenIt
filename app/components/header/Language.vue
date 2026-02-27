<template>
    <div class="language">
        <UIPopover>
            <template v-slot="{ toggle }">
                <div class="btn-lang"
                    @click.prevent.stop="toggle($event)"
                >
                    <span>{{ locale }}</span>

                    <Languages :size="16"/>
                </div>
            </template>

            <template #content>
                <UIMenu>
                    <UIMenuLabel>
                        {{ $t('langs') }}
                    </UIMenuLabel>

                    <UIMenuSeparator/>

                    <UIButton v-for="locale in locales" :key="locale.code"
                        variant="ghost"
                        style="margin-top: 4px; width: 100%;"
                        
                        @click="setLocale(locale.code)"
                    >
                        {{ locale.name }}
                    </UIButton>
                </UIMenu>
            </template>
        </UIPopover>
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