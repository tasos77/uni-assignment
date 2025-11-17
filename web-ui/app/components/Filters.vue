<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";
// emit events to parent component
const emit = defineEmits(["channel", "type", "brandTitle", "sortBy"]);

// filter states
const online = ref(false);
const instore = ref(false);
const student_discount = ref(false);
const freebie = ref(false);
const general_sale = ref(false);
const chickenMax = ref(false);
const bakeryBite = ref(false);
const pizzaWorld = ref(false);
const coffeeCentral = ref(false);
const barHub = ref(false);

// sort by options
const sortItems = ref<RadioGroupItem[]>([
  {
    label: "New in",
    value: "NEW_IN",
  },
  {
    label: "Ending soon",
    value: "ENDING_SOON",
  },
]);

// starting sort by value
const sortValue = ref("NEW_IN");
</script>

<template>
  <!-- Sidebar -->
  <UDashboardSidebar collapsible>
    <div class="flex flex-col items-center">
      <!---------- Filters ---------->
      <div class="text-2xl text-center mb-4">Filters</div>
      <USeparator />
      <div class="flex flex-col gap-5 mt-4 mb-4">
        <div>
          <div>Online / Instore</div>
          <UCheckbox
            v-model="online"
            label="Online"
            @change="emit('channel', { flag: 'channel', key: 'online' })"
          />
          <UCheckbox
            v-model="instore"
            label="Instore"
            @change="
              emit('channel', {
                flag: 'channel',
                key: 'instore',
              })
            "
          />
        </div>
        <div>
          <div>Offer Type</div>
          <UCheckbox
            v-model="student_discount"
            label="Student Discount"
            @change="
              emit('type', {
                flag: 'type',
                key: 'student_discount',
              })
            "
          />
          <UCheckbox
            v-model="freebie"
            label="Freebie"
            @change="emit('type', { flag: 'type', key: 'freebie' })"
          />
          <UCheckbox
            v-model="general_sale"
            label="General Sale"
            @change="
              emit('type', {
                flag: 'type',
                key: 'general_sale',
              })
            "
          />
        </div>
        <div>
          <div>Brands</div>
          <UCheckbox
            v-model="chickenMax"
            label="ChickenMax"
            @change="
              emit('brandTitle', {
                flag: 'brandTitle',
                key: 'chickenMax',
              })
            "
          />
          <UCheckbox
            v-model="bakeryBite"
            label="BakeryBite"
            @change="
              emit('brandTitle', {
                flag: 'brandTitle',
                key: 'bakeryBite',
              })
            "
          />
          <UCheckbox
            v-model="pizzaWorld"
            label="PizzaWorld"
            @change="
              emit('brandTitle', {
                flag: 'brandTitle',
                key: 'pizzaWorld',
              })
            "
          />
          <UCheckbox
            v-model="coffeeCentral"
            label="CoffeCentral"
            @change="
              emit('brandTitle', {
                flag: 'brandTitle',
                key: 'coffeeCentral',
              })
            "
          />
          <UCheckbox
            v-model="barHub"
            label="BarHub"
            @change="
              emit('brandTitle', {
                flag: 'brandTitle',
                key: 'barHub',
              })
            "
          />
        </div>
      </div>
      ">
      <!---------- Sorters ---------->
      <div class="text-2xl text-center mb-4">Sort By</div>
      <USeparator />
      <URadioGroup
        v-model="sortValue"
        :items="sortItems"
        class="mt-4"
        @change="
          emit('sortBy', {
            flag: 'sort',
            key: sortValue,
          })
        "
      />
    </div>
  </UDashboardSidebar>
</template>
