<script setup lang="ts"></script>

<template>
  <UHeader :toggle="false">
    <template #title>
      <UIcon name="i-lucide-circle-user-round" /> Tasos Lazarou
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
