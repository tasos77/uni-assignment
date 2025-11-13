<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { SignInCredsSchema, type SignInCreds } from "~/models/common";

definePageMeta({
  layout: "public",
});

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

const api = useApi();
const localstorage = useLocalStorage();
const showError = ref(false);
const errorText = ref("");
const loading = ref(false);

const onSubmit = async (payload: FormSubmitEvent<SignInCreds>) => {
  const { email, password } = payload.data;
  showError.value = false;
  loading.value = true;
  api
    .signIn({ email, password })
    .then((response) => {
      loading.value = false;
      localstorage.set("uniStudentsToken", response.data.token);
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
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :loading="loading"
        :schema="SignInCredsSchema"
        :fields="fields"
        title="Sign in to UniStudents"
        icon="i-lucide-lock"
        @submit="onSubmit"
      >
        <template #footer>
          Don't have an account?
          <ULink to="/sign-up" class="text-primary font-medium">Sign up</ULink>.
        </template>
        <template #password-hint>
          <ULink
            to="/forgot-password"
            class="text-primary font-medium"
            tabindex="-1"
            >Forgot password?</ULink
          >
        </template>
        <template #validation v-if="showError">
          <UAlert color="error" icon="i-lucide-info" :title="errorText" />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
