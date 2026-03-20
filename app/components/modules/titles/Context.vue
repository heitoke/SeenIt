<template>
    <Popover :fixed="true" style="width: 215px;">
        <template v-slot="{ show, hide }">
            <slot :show="show" :hide="hide"/>
        </template>

        <template #content>
            <Menu>
                <MenuButton @click="navigateTo(`/titles/${title._id}`)">
                    <Image/>

                    <span>{{ title?.tmdb?.title || title?.tmdb?.name }}</span>
                </MenuButton>

                <template v-if="title.parentCategory?.parentList?.parentDashboard?.canEdit">
                    <MenuSeparator/>

                    <MenuChildren>
                        <template #default>
                            <Heart style="margin-right: 8px;"/>
                            <span>{{ $t('liked') }}</span>
                        </template>

                        <template #content>
                            <MenuButton v-for="(_, i) of new Array(5)" :key="i"
                                @click="title.like(i)"
                            >
                                <TitleHeart :size="14" :step="i" :disabled-tooltip="true"/>
                                
                                <span>{{ $t(i > 0 ? 'liked' : 'unliked') }} - {{ i }}</span>
                            </MenuButton>
                        </template>
                    </MenuChildren>

                    <MenuButton @click="title.privateMode(!title.private)">
                        <Eye v-if="title.private"/>
                        <EyeOff v-else/>

                        <span>{{ $t(title.private ? 'publicMode' : 'privateMode') }}</span>
                    </MenuButton>

                    <MenuChildren>
                        <template #default>
                            <SendToBack style="margin-right: 8px;"/>

                            <span>{{ $t('moveTo') }}...</span>
                        </template>

                        <template #content>
                            <MenuButton v-for="category of title.parentCategory?.parentList?.categories" :key="category._id"
                                @click="title.move(category._id)"
                            >
                                <span>{{ category.name }}</span>
                            </MenuButton>
                        </template>
                    </MenuChildren>

                    <MenuSeparator/>

                    <Dialog
                        :title="`${$t('delete')} ${title?.tmdb?.title || title.tmdb?.name }`"
                        :description="$t('confirmDelete.description')"
                    >
                        <template v-slot="{ show }">
                            <MenuButton @click="show">
                                <Trash/>

                                <span>{{ $t('delete') }}</span>
                            </MenuButton>
                        </template>
                        
                        <template v-slot:content="{ hide }">
                            <ButtonGroup>
                                <Button @click="hide">
                                    <span>{{ $t('cancel') }}</span>
                                </Button>

                                <Button variant="destructive" @click="hide(); title.delete()">
                                    <Trash/>
                                    <span>{{ $t('delete') }}</span>
                                </Button>
                            </ButtonGroup>
                        </template>
                    </Dialog>
                </template>
            </Menu>
        </template>
    </Popover>
</template>

<script lang="ts" setup>

// * Components
import TitleHeart from './badges/Like.vue';

import { Heart, Eye, EyeOff, SendToBack, Trash, Image } from 'lucide-vue-next';

// * Types
import type { DashboardTitle } from '~/libs/dashboard';


interface Props {
    title: DashboardTitle;
    disabled?: boolean;
}


const props = withDefaults(defineProps<Props>(), {
    disabled: false
});

</script>