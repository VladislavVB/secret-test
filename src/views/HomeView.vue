<script setup lang="ts">
import AccountList from '@/components/Accounts/AccountList.vue'
import { useAccountsStore, type AccountInterface } from '@/stores/accounts'
import { mdiPlus, mdiHelpCircleOutline } from '@mdi/js'

const stateAccounts = useAccountsStore()

function addNewAccount() {
  const mock2 = {
    id: new Date().getMilliseconds(),
    tags: [],
    login: '',
    recordType: 'LDAP',
    password: null,
  } as AccountInterface
  stateAccounts.createAccount(mock2)
}
</script>

<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <h2>Учетные записи</h2>
      <v-btn @click="addNewAccount()" :icon="mdiPlus" class="ml-4"></v-btn>
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
