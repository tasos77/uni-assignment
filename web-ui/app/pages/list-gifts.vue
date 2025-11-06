<script setup lang="ts"></script>

<template>
  <div class="flex justify-between items-center p-4">
    <Categories />
    <Search />
  </div>
  <USeparator />
  <UPage>
    <template #left>
      <div class="flex flex-col gap-3">
        <Filters />
      </div>
    </template>
    <UPageBody class="border-l p-3 m-0"> <Gifts /> </UPageBody>
  </UPage>
</template>

<style scoped></style>
