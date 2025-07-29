<template>
    <Dialog>
        <DialogTrigger as-child>
            <slot/>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>{{ text }}</DialogDescription>
            </DialogHeader>
            <div class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">{{ fieldText || 'Name' }}</Label>
                    <Input id="name" v-model="name" class="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose>
                    <Button :disabled="!name"
                        type="submit"
                        @click="$emit('save', { name })"
                    >{{ btnText || 'Save' }}</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>

export interface List {
    name: string;
}


defineEmits({
    save(data: List) {
        return data;
    }
});


defineProps<{
    title?: string;
    text?: string;
    fieldText?: string;
    btnText?: string;
}>();


const name = ref('');

</script>