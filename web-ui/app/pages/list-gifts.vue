<script setup lang="ts">
import type { Gift, User } from "~/models/common";

const localstorage = useLocalStorage();
const api = useApi();
const gifts = ref<Gift[]>([]);
const user = ref<User>({
  email: "",
  fullName: "",
});

const claimLoading = ref(false);
const showClaimError = ref(false);

const pageSize: number = 5;
let page: number = 1;
let totalCount: number = 0;
let lastSearchType: "filters" | "search" = "filters";

let channels: string[] = [];
let types: string[] = [];
let brandTitles: string[] = [];
let category: string = "All";
let sortBy: string = "NEW_IN";

let queryChannels = "";
let queryTypes = "";
let queryBrantTitles = "";

let searchInput: string = "";

const claimGift = (giftId: string) => {
  showClaimError.value = false;
  claimLoading.value = true;
  api
    .claim(user.value.email, giftId)
    .then(() => {
      claimLoading.value = false;
      const gift = gifts.value.find((gift) => gift.id === giftId);
      if (gift) {
        user.value.claimedGifts?.push(gift);
      }
    })
    .catch(() => {
      claimLoading.value = false;
      showClaimError.value = true;
    });
};

const getFilteredGifts = (filter: {
  flag: "channel" | "type" | "brandTitle" | "category" | "sort";
  key: string;
}) => {
  page = 1;
  gifts.value = [];
  lastSearchType = "filters";
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
  if (filter.flag === "sort") {
    sortBy = filter.key;
  }

  queryChannels = channels.join(",");
  queryTypes = types.join(",");
  queryBrantTitles = brandTitles.join(",");

  api
    .getGifts(
      queryChannels,
      queryTypes,
      queryBrantTitles,
      category,
      page,
      sortBy
    )
    .then((response) => {
      gifts.value.push(...response.data.data.gifts);
      totalCount = response.data.data.totalCount;
      page = response.data.data.page;
    })
    .catch((err) => {
      if (err.response.data.error === "Invalid authorization token") {
        logout();
      }
    });
};

const search = (input: string) => {
  searchInput = input;
  gifts.value = [];
  page = 1;
  lastSearchType = "search";
  api
    .search(input, page, sortBy)
    .then((response) => {
      gifts.value.push(...response.data.data.gifts);
      totalCount = response.data.data.totalCount;
      page = response.data.data.page;
    })
    .catch((err) => {
      if (err.response.data.error === "Invalid authorization token") {
        logout();
      }
    });
};

const scroll = () => {
  window.onscroll = () => {
    let bottomOfWindow =
      Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      ) +
        window.innerHeight ===
      document.documentElement.offsetHeight;

    if (bottomOfWindow) {
      if (page <= totalCount / pageSize) {
        if (lastSearchType === "filters") {
          lastSearchType = "filters";
          page += 1;
          api
            .getGifts(
              queryChannels,
              queryTypes,
              queryBrantTitles,
              category,
              page,
              sortBy
            )
            .then((response) => {
              gifts.value.push(...response.data.data.gifts);
              totalCount = response.data.data.totalCount;
              page = response.data.data.page;
            })
            .catch((err) => {
              if (err.response.data.error === "Invalid authorization token") {
                logout();
              }
            });
        } else {
          lastSearchType = "search";
          page += 1;
          api
            .search(searchInput, page, sortBy)
            .then((response) => {
              gifts.value.push(...response.data.data.gifts);
              totalCount = response.data.data.totalCount;
              page = response.data.data.page;
            })
            .catch((err) => {
              if (err.response.data.error === "Invalid authorization token") {
                logout();
              }
            });
        }
      }
    }
  };
};

onMounted(async () => {
  const usersEmail = localstorage.get("uniStudentsUserEmail");
  api
    .getUser(usersEmail)
    .then((response) => {
      user.value = response.data.user;
    })
    .catch((err) => {
      if (err.response.data.error === "Invalid authorization token") {
        logout();
      }
    });

  api
    .getGifts(
      queryChannels,
      queryTypes,
      queryBrantTitles,
      category,
      page,
      sortBy
    )
    .then((response) => {
      gifts.value.push(...response.data.data.gifts);
      totalCount = response.data.data.totalCount;
      page = response.data.data.page;
    })
    .catch((err) => {
      if (err.response.data.error === "Invalid authorization token") {
        logout();
      }
    });

  scroll();
});

const logout = () => {
  localstorage.remove("uniStudentsToken");
  localstorage.remove("uniStudentsUserEmail");
  navigateTo("/sign-in");
};
</script>

<template>
  <UHeader :toggle="false">
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-circle-user-round" size="25" />
        <div>{{ user.fullName }}</div>
      </div>
    </template>
    <template #default>
      <span class="text-2xl"> Student Gifts </span>
    </template>
    <template #right>
      <UColorModeButton />
      <UButton
        @click="logout"
        color="neutral"
        variant="ghost"
        target="_blank"
        icon="i-lucide-log-out"
      />
    </template>
  </UHeader>
  <UMain>
    <div class="flex justify-between items-center p-4">
      <Categories @category="getFilteredGifts" />
      <Search @search="search" />
    </div>
    <USeparator />

    <UPageBody class="flex justify-start">
      <Filters
        @channel="getFilteredGifts"
        @type="getFilteredGifts"
        @brand-title="getFilteredGifts"
        @sort-by="getFilteredGifts"
      />

      <Gifts
        :gifts="gifts"
        :user="user"
        :loading="claimLoading"
        :error="showClaimError"
        @claim="claimGift"
      />
    </UPageBody>
  </UMain>
</template>
