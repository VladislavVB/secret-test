<script setup lang="ts">
import { ref } from 'vue'
import { type AccountInterface, RecordTypeEnums } from '@/types/account.types'
import { useAccountsStore } from '@/stores/accounts'
import { validatePassword, getAccountErrors } from './accountValidation'
import { mdiEyeOff, mdiEye } from '@mdi/js'

interface Props {
  account: AccountInterface
}

const props = defineProps<Props>()

const { validationErrors } = useAccountsStore()
const showPassword = ref(false)

function handlePasswordChange(value: string) {
  props.account.password = value
}

function handlePasswordBlur() {
  const error = validatePassword(props.account.password, props.account.recordType)
  const accountErrors = getAccountErrors(validationErrors, props.account.id)
  if (error) {
    accountErrors.password = error
  } else {
    delete accountErrors.password
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div v-if="account.recordType === RecordTypeEnums.Local" class="w-100">
    <v-text-field
      :model-value="account.password || ''"
      @update:model-value="handlePasswordChange"
      @blur="handlePasswordBlur"
      :type="showPassword ? 'text' : 'password'"
      :error="!!validationErrors[account.id]?.password"
      :error-messages="validationErrors[account.id]?.password"
      density="compact"
      variant="outlined"
      :maxlength="100"
      :counter="account.password?.length || 0"
    >
      <template #append-inner>
        <v-icon
          @click="togglePasswordVisibility"
          :icon="showPassword ? mdiEyeOff : mdiEye"
          size="small"
          class="cursor-pointer"
        />
      </template>
    </v-text-field>
  </div>
</template>
