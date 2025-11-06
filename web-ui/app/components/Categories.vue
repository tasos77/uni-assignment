<script setup lang="ts">
const items = ref(["All", "Pizza", "Food", "Coffee", "Bars"]);
</script>

<template>
  <URadioGroup
    orientation="horizontal"
    indicator="hidden"
    variant="card"
    default-value="All"
    :items="items"
  />
</template>

<style scoped></style>
