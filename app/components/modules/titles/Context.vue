<template>
    <ContextMenu>
        <ContextMenuTrigger>
            <slot/>
        </ContextMenuTrigger>
        <ContextMenuContent class="w-56" v-if="!disabled">
            <ContextMenuItem @click="navigateTo(`/titles/${title.id}`)">
                <Image/>

                <span>{{ title?.data?.title || title?.data?.name }}</span>
            </ContextMenuItem>

            <ContextMenuSeparator/>

            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    <Heart style="margin-right: 8px;"/>
                    <span>{{ $t('liked') }}</span>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    <ContextMenuItem v-for="(_, i) of new Array(5)" :key="i"
                        @click="title.like(i)"
                    >
                        <TitleHeart :size="14" :step="i" :disabled-tooltip="true"/>
                        
                        <span>{{ $t(i > 0 ? 'liked' : 'unliked') }} - {{ i }}</span>
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuItem @click="title.setPrivate(!title.private)">
                <Eye v-if="title.private"/>
                <EyeOff v-else/>

                <span>{{ $t(title.private ? 'publicMode' : 'privateMode') }}</span>
            </ContextMenuItem>
    
            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    <SendToBack style="margin-right: 8px;"/>

                    <span>{{ $t('moveTo') }}...</span>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    <ContextMenuItem v-for="category of title.category?.list?.categories" :key="category.id"
                        @click="title.move(category.id)"
                    >
                        <span>{{ category.name }}</span>
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSeparator/>

            <ContextMenuItem @click="confirmDelete = true">
                <Trash/>

                <span>{{ $t('delete') }}</span>
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>

    <Dialog v-model:open="confirmDelete">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ $t('delete') }} {{ title?.data?.title || title.data?.name }}</DialogTitle>
                <DialogDescription>{{ $t('confirmDelete.description') }}</DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
                <DialogClose>
                    <Button variant="secondary">
                        <span>Cancel</span>
                    </Button>
                </DialogClose>
                <DialogClose>
                    <Button variant="destructive" @click="title.delete()">
                        <Trash/>
                        <span>{{ $t('delete') }}</span>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>

// * Components
import TitleHeart from './Heart.vue';

import { Heart, Eye, EyeOff, SendToBack, Trash, Image } from 'lucide-vue-next';

// * Types
import type { Title } from '~~/types/list';


interface Props {
    title: Title;
    disabled?: boolean;
}


const props = withDefaults(defineProps<Props>(), {
    disabled: false
});


const confirmDelete = ref<boolean>(false);

</script>