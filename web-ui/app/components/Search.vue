<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { SearchSchema, type Search } from "~/models/common";

const emit = defineEmits(["search"]);

const state = reactive<Partial<Search>>({
  input: undefined,
});

const onSubmit = (event: FormSubmitEvent<Search>) => {
  const trimmedInput = event.data.input.trim();
  if (trimmedInput.length > 0) {
    emit("search", trimmedInput);
  }
};
</script>
<template>
  <div>
    <UForm :schema="SearchSchema" :state="state" @submit="onSubmit">
      <UFormField name="input">
        <UInput
          v-model="state.input"
          placeholder="Search by title..."
          variant="subtle"
          icon="i-lucide-search"
        />
      </UFormField>
    </UForm>
  </div>
</template>
