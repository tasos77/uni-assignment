<script setup lang="ts">
const items = ref(["All", "Pizza", "Food", "Coffee", "Bars"]);
const category = ref("All");
const emit = defineEmits(["category"]);
</script>

<template>
  <URadioGroup
    v-model="category"
    orientation="horizontal"
    indicator="hidden"
    variant="card"
    default-value="All"
    :items="items"
    @change="emit('category', { flag: 'category', key: category })"
  />
</template>

<style scoped></style>
