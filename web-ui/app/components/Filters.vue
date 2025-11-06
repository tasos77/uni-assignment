<template>
  <div class="text-2xl text-center pt-3">Filters</div>
  <USeparator />
  <div class="flex flex-col gap-5 ps-4">
    <div>
      <div>Online / Instore</div>
      <UCheckbox label="Online" />
      <UCheckbox label="Instore" />
    </div>
    <div>
      <div>Offer Type</div>
      <UCheckbox label="Student Discount" />
      <UCheckbox label="Freebie" />
      <UCheckbox label="General Sale" />
    </div>
    <div>
      <div>Brands</div>
      <UCheckbox label="ChickenMax" />
      <UCheckbox label="BakeryBite" />
      <UCheckbox label="PizzaWorld" />
      <UCheckbox label="CoffeCentral" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
