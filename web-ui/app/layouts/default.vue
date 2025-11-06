<script setup lang="ts"></script>

<template>
  <UHeader :toggle="false">
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-circle-user-round" size="25" />
        <div>Tasos Lazarou</div>
      </div>
    </template>
    <template #default>
      <span class="text-2xl"> Student Gifts </span>
    </template>
    <template #right>
      <UColorModeButton />
      <UButton
        color="neutral"
        variant="ghost"
        to="/sign-in"
        target="_blank"
        icon="i-lucide-log-out"
      />
    </template>
  </UHeader>
  <UMain>
    <slot />
  </UMain>
</template>
