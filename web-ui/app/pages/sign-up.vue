<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { SignUpFormDataSchema, type SignUpFormData } from "~/models/common";

// page meta
definePageMeta({
  layout: "public",
});

// form fields
const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
];

// reactive states
const api = useApi();
const showError = ref(false);
const showSuccess = ref(false);
const errorText = ref("");
const loading = ref(false);

// handle sign-up submission
const onSubmit = async (payload: FormSubmitEvent<SignUpFormData>) => {
  const { email, password, fullName } = payload.data;
  showError.value = false;
  showSuccess.value = false;
  loading.value = true;
  api
    .signUp({
      email: email.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
    })
    .then((response) => {
      if (response.data.message) {
        loading.value = false;
        showSuccess.value = true;
      }
    })
    .catch((err) => {
      loading.value = false;
      errorText.value = err?.response?.data?.error
        ? err.response.data.error
        : "Failed to sign up!";
      showError.value = true;
    });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <!-- Sign Up Card -->
    <UPageCard class="w-full max-w-md">
      <!-- Sign Up Form -->
      <UAuthForm
        :loading="loading"
        :schema="SignUpFormDataSchema"
        :fields="fields"
        title="Sign Up"
        icon="i-lucide-book-open-check"
        @submit="onSubmit"
      >
        <!-- Footer Link -->
        <template #footer>
          Already have an account?
          <ULink to="/sign-in" class="text-primary font-medium">Sign in</ULink>.
        </template>
        <!-- Validation Alerts -->
        <template #validation>
          <UAlert
            v-if="showSuccess"
            color="success"
            icon="i-lucide-info"
            title="User created!"
          />
          <UAlert
            v-if="showError"
            color="error"
            icon="i-lucide-info"
            :title="errorText"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
