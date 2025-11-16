<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { SignUpFormDataSchema, type SignUpFormData } from "~/models/common";

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
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
];

const api = useApi();
const showError = ref(false);
const showSuccess = ref(false);
const errorText = ref("");
const loading = ref(false);

const onSubmit = async (payload: FormSubmitEvent<SignUpFormData>) => {
  const { email, password, fullName } = payload.data;
  showError.value = false;
  showSuccess.value = false;
  loading.value = true;
  api
    .signUp({ email, password, fullName })
    .then((response) => {
      loading.value = false;
      showSuccess.value = true;
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
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :loading="loading"
        :schema="SignUpFormDataSchema"
        :fields="fields"
        title="Sign Up"
        icon="i-lucide-book-open-check"
        @submit="onSubmit"
      >
        <template #footer>
          Already have an account?
          <ULink to="/sign-in" class="text-primary font-medium">Sign in</ULink>.
        </template>

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
