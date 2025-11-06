<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

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
    name: "remember",
    label: "Remember me",
    type: "checkbox",
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(4, "Must be at least 4 characters"),
});

type Schema = z.output<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log("Submitted", payload);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
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
        <template #validation>
          <UAlert color="error" icon="i-lucide-info" title="Error signing in" />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
