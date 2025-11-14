<script setup lang="ts">
const api = useApi();
const gifts = ref([]);

const claim = (id: string) => {
  console.log(id);
};

onMounted(() => {
  api
    .getGifts()
    .then((response) => {
      gifts.value = response.data.gifts;
      console.log(gifts.value);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
});
</script>

<template>
  <div class="flex justify-between items-center p-4">
    <Categories />
    <Search />
  </div>
  <USeparator />
  <UPage>
    <UPageBody class="flex justify-center">
      <Filters />
      <Gifts :gifts="gifts" @claim="claim" />
    </UPageBody>
  </UPage>
</template>

<style scoped></style>
