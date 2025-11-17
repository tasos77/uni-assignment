<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { SignInCredsSchema, type SignInCreds } from "~/models/common";

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
];

// reactive states
const api = useApi();
const localstorage = useLocalStorage();
const showError = ref(false);
const errorText = ref("");
const loading = ref(false);

// handle sign-in submission
const onSubmit = async (payload: FormSubmitEvent<SignInCreds>) => {
  const { email, password } = payload.data;
  showError.value = false;
  loading.value = true;
  api
    .signIn({ email: email.trim(), password: password.trim() })
    .then((response) => {
      loading.value = false;
      localstorage.set("uniStudentsToken", response.data.token);
      localstorage.set("uniStudentsUserEmail", email);
      navigateTo("/list-gifts");
    })
    .catch((err) => {
      loading.value = false;
      errorText.value = err?.response?.data?.error
        ? err.response.data.error
        : "Failed to sign in!";
      showError.value = true;
    });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <!-- Sign In Card -->
    <UPageCard class="w-full max-w-md">
      <!-- Sign In Form -->
      <UAuthForm
        :loading="loading"
        :schema="SignInCredsSchema"
        :fields="fields"
        title="Sign in to UniStudents"
        icon="i-lucide-lock"
        @submit="onSubmit"
      >
        <!-- Footer Link -->
        <template #footer>
          Don't have an account?
          <ULink to="/sign-up" class="text-primary font-medium">Sign up</ULink>.
        </template>
        <!-- Password Hint Link -->
        <template #password-hint>
          <ULink
            to="/forgot-password"
            class="text-primary font-medium"
            tabindex="-1"
            >Forgot password?</ULink
          >
        </template>
        <!-- Validation Error Alert -->
        <template #validation v-if="showError">
          <UAlert color="error" icon="i-lucide-info" :title="errorText" />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
