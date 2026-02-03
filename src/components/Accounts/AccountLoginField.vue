<script setup lang="ts">
import type { AccountInterface } from '@/types/account.types';
import { validateLogin, getAccountErrors } from './accountValidation'
import { useAccountsStore } from '@/stores/accounts'

interface Props {
  account: AccountInterface
}

const props = defineProps<Props>()

const { validationErrors } = useAccountsStore()

function handleLoginChange(value: string) {
  props.account.login = value
}

function handleLoginBlur() {
  const error = validateLogin(props.account.login)
  const accountErrors = getAccountErrors(validationErrors, props.account.id)
  if (error) {
    accountErrors.login = error
  } else {
    delete accountErrors.login
  }
}
</script>

<template>
  <v-text-field
    :model-value="account.login"
    @update:model-value="handleLoginChange"
    @blur="handleLoginBlur"
    :error="!!validationErrors[account.id]?.login"
    :error-messages="validationErrors[account.id]?.login"
    density="compact"
    variant="outlined"
    :maxlength="100"
    :counter="account.login?.length || 0"
  />
</template>

