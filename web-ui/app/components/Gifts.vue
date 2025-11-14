<script setup lang="ts">
import type { Gift } from "~/models/common";

interface Props {
  gifts: Gift[];
}

const props = defineProps<Props>();
const emits = defineEmits(["claim"]);
</script>

<template>
  <div class="flex flex-wrap justify-center gap-6 p-2">
    <UCard
      v-for="gift in props.gifts"
      :key="gift.id"
      class="max-w-200 hover:outline-1"
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
        <div class="flex justify-end">
          <img
            :src="gift.brandLogoUrl"
            width="40"
            height="40"
            class="rounded-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <UButton
            label="Claim"
            class="cursor-pointer"
            @click="emits('claim', gift.id)"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
