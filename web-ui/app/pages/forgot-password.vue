<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import type { StepperItem } from "@nuxt/ui";
import {
  EmailSchema,
  MatchUserSchema,
  NewPasswordSchema,
  PasswordSchema,
  type Email,
  type MatchUser,
  type NewPassword,
} from "~/models/common";

definePageMeta({
  layout: "public",
});

const matchUserfield: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
];

const newPasswordFields: AuthFormField[] = [
  {
    name: "password",
    label: "New Password",
    type: "password",
    placeholder: "New password",
    required: true,
  },
];

const items = [
  {
    slot: "matchUser" as const,
    title: "Match User",
    icon: "i-lucide-user",
  },
  {
    slot: "newPassword" as const,
    title: "Update Password",
    icon: "i-lucide-lock",
  },
] satisfies StepperItem[];

const api = useApi();
const step = ref(0);
const matchUserError = ref(false);
const updatePasswordError = ref(false);
const updatePasswordSucceed = ref(false);
const oneTimeToken = ref("");
const usersEmail = ref("");

const onMatchUserSubmit = (payload: FormSubmitEvent<MatchUser>) => {
  const { email } = payload.data;
  matchUserError.value = false;

  api
    .matchUser(email)
    .then((response) => {
      oneTimeToken.value = response.data.token;
      usersEmail.value = email;
      step.value += 1;
    })
    .catch(() => {
      matchUserError.value = true;
    });
};

const newPasswordSubmit = (payload: FormSubmitEvent<NewPassword>) => {
  const { password } = payload.data;
  updatePasswordSucceed.value = false;
  updatePasswordError.value = false;

  api
    .updatePassword({ email: usersEmail.value, password }, oneTimeToken.value)
    .then(() => {
      updatePasswordSucceed.value = true;
    })
    .catch(() => {
      updatePasswordError.value = true;
    });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UStepper :items="items" class="w-full" v-model="step" disabled>
        <template #matchUser>
          <UAuthForm
            :schema="MatchUserSchema"
            :fields="matchUserfield"
            title="Forgot Password?"
            icon="i-lucide-rotate-ccw-key"
            @submit="onMatchUserSubmit"
          >
            <template #footer>
              Navigate to
              <ULink to="/sign-in" class="text-primary font-medium"
                >Sign in</ULink
              >.
            </template>
            <template #validation>
              <UAlert
                v-if="matchUserError"
                color="error"
                icon="i-lucide-info"
                title="User match failed!"
              />
            </template>
          </UAuthForm>
        </template>
        <template #newPassword>
          <UAuthForm
            :schema="NewPasswordSchema"
            :fields="newPasswordFields"
            title="Forgot Password?"
            icon="i-lucide-rotate-ccw-key"
            @submit="newPasswordSubmit"
          >
            <template #footer>
              Navigate to
              <ULink to="/sign-in" class="text-primary font-medium"
                >Sign in</ULink
              >.
            </template>
            <template #validation>
              <UAlert
                v-if="updatePasswordSucceed"
                color="success"
                icon="i-lucide-info"
                title="Password update succeed!"
              />
              <UAlert
                v-if="updatePasswordError"
                color="error"
                icon="i-lucide-info"
                title="Password update failed!"
              />
            </template>
          </UAuthForm>
        </template>
      </UStepper>
    </UPageCard>
  </div>
</template>
