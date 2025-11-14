<script setup lang="ts">
const api = useApi();
const gifts = ref([]);

let channels: string[] = [];
let types: string[] = [];
let brandTitles: string[] = [];
let category: string = "All";

let queryChannels = "";
let queryTypes = "";
let queryBrantTitles = "";

const claim = (id: string) => {
  console.log(id);
};

const getFilteredGifts = (filter: {
  flag: "channel" | "type" | "brandTitle" | "category";
  key: string;
}) => {
  if (filter.flag === "channel") {
    if (channels.includes(filter.key)) {
      channels = channels.filter((item) => item !== filter.key);
    } else {
      channels.push(filter.key);
    }
  }
  if (filter.flag === "type") {
    const formatedKey = filter.key.replace("_", "-");
    if (types.includes(formatedKey)) {
      types = types.filter((item) => item !== formatedKey);
    } else {
      types.push(formatedKey);
    }
  }
  if (filter.flag === "brandTitle") {
    let formatedKey = filter.key;
    formatedKey = formatedKey[0].toUpperCase() + formatedKey.slice(1);
    if (brandTitles.includes(formatedKey)) {
      brandTitles = brandTitles.filter((item) => item !== formatedKey);
    } else {
      brandTitles.push(formatedKey);
    }
  }
  if (filter.flag === "category") {
    category = filter.key;
  }

  const queryChannels = channels.join(",");
  const queryTypes = types.join(",");
  const queryBrantTitles = brandTitles.join(",");

  api
    .getGifts(queryChannels, queryTypes, queryBrantTitles, category)
    .then((response) => {
      gifts.value = response.data.gifts;
    })
    .catch((err) => {
      console.log(err);
    });
};

const search = (input: string) => {
  api
    .search(input)
    .then((response) => {
      gifts.value = response.data.gifts;
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  api
    .getGifts(queryChannels, queryTypes, queryBrantTitles, category)
    .then((response) => {
      gifts.value = response.data.gifts;
    })
    .catch((err) => {
      console.log(err.response.data);
    });
});
</script>

<template>
  <div class="flex justify-between items-center p-4">
    <Categories @category="getFilteredGifts" />
    <Search @search="search" />
  </div>
  <USeparator />
  <UPage>
    <UPageBody class="flex justify-start h-1">
      <Filters
        @channel="getFilteredGifts"
        @type="getFilteredGifts"
        @brand-title="getFilteredGifts"
      />
      <Gifts :gifts="gifts" @claim="claim" />
    </UPageBody>
  </UPage>
</template>

<style scoped></style>
