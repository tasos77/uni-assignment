<script setup lang="ts">
// possivle values for category filter
const items = ref(["All", "Pizza", "Food", "Coffee", "Bars"]);

// starting category
const category = ref("All");

// emit event to parent component
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
