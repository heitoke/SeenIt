<template>
    <div class="language">
        <Popover style="padding: 4px; width: 215px;">
            <template v-slot="{ toggle }">
                <div class="btn-lang" @click="toggle">
                    <span>{{ globalLocale }}</span>

                    <Languages :size="16"/>
                </div>
            </template>
            
            <template #content>
                <Menu>
                    <MenuLabel>{{ $t('langs') }}</MenuLabel>

                    <MenuSeparator/>

                    <MenuRadio v-for="locale in locales" :key="locale.code"
                        name="lang"
                        :label="`${locale.name} ${languages[locale.code].emoji}`"
                        :value="locale.code"

                        v-model="globalLocale"

                        @click="setLocale(locale.code)"
                    />
                </Menu>
            </template>
        </Popover>
    </div>
</template>

<script lang="ts" setup>

import { Languages } from 'lucide-vue-next';
import { languages } from '~~/types/locale';


const { locales, locale: globalLocale, setLocale } = useI18n();

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