<template>
    <Dialog v-model:open="open" @update:open="onOpen">
        <DialogTrigger as-child>
            <slot/>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]" v-if="category">
            <DialogHeader>
                <DialogTitle>{{ category?.name }}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>

            <Input v-model="category.name"/>

            <div class="flex items-center space-x-2">
                <Switch id="airplane-mode" v-model="category.private"/>
                <Label for="airplane-mode">{{ $t('privateMode') }}</Label>
            </div>

            <DialogFooter>
                <Button variant="destructive"
                    @click="onDeleteList"
                >
                    <Trash/>
                    <span>{{ $t('delete') }}</span>
                </Button>

                <Button
                    @click="onSaveList"
                >
                    <Save/>
                    <span>{{ $t('save') }}</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>

import { Save, Trash } from 'lucide-vue-next';

// * Stores
import { useListsStore } from '~/stores/lists';

// * Types
import type { Category, List } from '~~/types/list';


const $lists = useListsStore();


const props = defineProps<{
    userId: string;
    categoryId: number;
}>();


const open = ref(false);
const category = ref<Category>();


function onOpen(bool: boolean) {
    if (!bool || !props.userId || !props.categoryId) return;

    const $cl = $lists.get(props.userId)!;

    const c = $cl.get('category', props.categoryId);

    if (!c) return;

    category.value = { ...c };
}


async function onSaveList() {
    if (!category.value) return;

    const { name, private: privateMode } = category.value;

    const r = await category.value.update!({ name, private: privateMode });

    if (!r) return;

    open.value = false;
}

async function onDeleteList() {
    if (!category.value) return;

    const r = await category.value.delete!();

    if (!r) return;

    open.value = false;
}

</script>