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
];

const api = useApi();

const onSubmit = async (payload: FormSubmitEvent<SignUpFormData>) => {
  console.log("Submitted", payload);
  const result = await api.signUp(payload);
  console.log(result);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
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
          <UAlert color="error" icon="i-lucide-info" title="Error signing up" />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
