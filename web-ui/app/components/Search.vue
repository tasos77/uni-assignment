<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { SearchSchema, type Search } from "~/models/common";
// emit search event to parent component
const emit = defineEmits(["search"]);

// reactive state for search input
const state = reactive<Partial<Search>>({
  input: undefined,
});

// handle search, only if input is not empty
const onSubmit = (event: FormSubmitEvent<Search>) => {
  const trimmedInput = event.data.input ? event.data.input.trim() : "";
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
