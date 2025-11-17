<script setup lang="ts">
import type { Gift, User } from "~/models/common";
// define component props
interface Props {
  gifts: Gift[];
  user: User;
  loading: boolean;
  error: boolean;
}

// get props
const props = defineProps<Props>();
const emit = defineEmits(["claim"]);

// function to check if gift is claimed by user
const isClaimed = (gift: Gift) => {
  return props.user.claimedGifts?.some(
    (claimedGift) => claimedGift.id === gift.id
  );
};
</script>

<template>
  <div class="flex flex-wrap justify-center gap-6 p-2">
    <UCard
      v-for="gift in props.gifts"
      :key="gift.id"
      class="max-w-180 hover:outline-1 h-min"
      :class="isClaimed(gift) ? 'hover:outline-green-500' : 'hover:outline'"
      variant="soft"
    >
      <template #header>
        <img :src="gift.imageUrl" style="max-height: 430px" />
      </template>
      <div class="flex flex-col gap-4" style="">
        <div>{{ gift.brandTitle }}</div>
        <div class="text-xl">{{ gift.title }}</div>
        <div>{{ gift.description }}</div>
        <div class="text-sm">
          Terms:
          <span class="opacity-45 italic">{{ gift.terms }}</span>
        </div>
        <div class="flex justify-between">
          <UBadge
            :label="gift.status === 'NEW_IN' ? 'New In' : 'Ending Soon'"
            variant="subtle"
            :color="gift.status === 'NEW_IN' ? 'success' : 'error'"
          />
          <div>
            <img
              :src="gift.brandLogoUrl"
              width="40"
              height="40"
              class="rounded-full"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end items-end flex-col gap-2">
          <UButton
            :disabled="isClaimed(gift)"
            :loading="props.loading"
            :label="isClaimed(gift) ? 'Claimed' : 'Claim'"
            class="cursor-pointer"
            @click="emit('claim', gift.id)"
          />
          <div v-if="props.error" class="text-error">Failed to claim gift!</div>
        </div>
      </template>
    </UCard>
  </div>
</template>
