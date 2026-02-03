<script setup lang="ts">
import AccountList from '@/components/Accounts/AccountList.vue'
import { validateAccount } from '@/components/Accounts/accountValidation'
import {  useAccountsStore } from '@/stores/accounts'
import { RecordTypeEnums, type AccountInterface } from '@/types/account.types'

import { mdiPlus, mdiHelpCircleOutline } from '@mdi/js'

const stateAccounts = useAccountsStore()
const validationErrors = stateAccounts.validationErrors

function validateAllAccounts(): boolean {
  let hasErrors = false

  stateAccounts.accounts.forEach((account) => {
    const errors = validateAccount(account)

    if (Object.keys(errors).length > 0) {
      validationErrors[account.id] = errors
      hasErrors = true
    } else {
      delete validationErrors[account.id]
    }
  })

  return !hasErrors
}

function addNewAccount() {
  const isValid = validateAllAccounts()
  if (!isValid) {
    return
  }

  const newAccount = {
    id: Date.now(),
    tags: [],
    login: '',
    recordType: RecordTypeEnums.Local,
    password: '',
  } as AccountInterface

  stateAccounts.createAccount(newAccount)

  validationErrors[newAccount.id] = {}
}
</script>

<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <h2>Учетные записи</h2>
      <v-btn @click="addNewAccount" :icon="mdiPlus" class="ml-4"></v-btn>
    </div>
    <v-alert
      color="info"
      :icon="mdiHelpCircleOutline"
      text='Для указания нескольких меток для одной пары логин/парль используйте разделитель ";"'
    ></v-alert>

    <v-card class="mt-4">
      <account-list />
    </v-card>
  </div>
</template>
