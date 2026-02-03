<!-- <script setup lang="ts">
import { RecordTypeEnums, useAccountsStore, type AccountInterface } from '@/stores/accounts'
import { mdiEyeOff, mdiEye, mdiDelete } from '@mdi/js'
import { ref } from 'vue'

const headers = ref([
  { title: 'Метки', key: 'tags',  width: '25%' },
  { title: 'Тип записи', key: 'recordType', width: '25%' },
  { title: 'Логин', key: 'login',width: '25%' },
  { title: 'Пароль', key: 'password', width: '25%' },
  { title: '', key: 'actions', },
])
const stateAccounts = useAccountsStore()
const showPassword = ref<Record<number, boolean>>({})

const togglePasswordVisibility = (id: number) => {
  showPassword.value[id] = !showPassword.value[id]
}

const recordTypeOptions = [
  { title: 'Локальная', value: RecordTypeEnums.Local },
  { title: 'LDAP', value: RecordTypeEnums.LDAP },
]
const mock = {
  id: 1,
  login: 'Login',
  tags: 'XXXXXX ; XX',
  recordType: 'local',
  password: 'pass',
} as AccountInterface

function addNewAccount() {
  const mock2 = {
    id: new Date().getMilliseconds(),
    tags: '',
    login: '',
    recordType: 'LDAP',
  } as AccountInterface
  stateAccounts.createAccount(mock2)
}

function removeAccount(accountId: number) {
  stateAccounts.deleteAccount(accountId)
}
</script>

<template>
  <v-data-table :headers="headers" :items="stateAccounts.accounts" hide-default-footer>
    <template v-slot:item.tags="{ item }">
      <v-textarea v-model="item.tags" auto-grow rows="1" variant="outlined" density="compact" hide-details />
    </template>

    <template v-slot:item.recordType="{ item }">
      <v-select
        v-model="item.recordType"
        :items="recordTypeOptions"
        density="compact"
        variant="outlined"
        hide-details
      />
    </template>

    <template v-slot:item.login="{ item }">
      <v-text-field v-model="item.login" density="compact" variant="outlined" hide-details />
    </template>

    <template v-slot:item.password="{ item }">
      <v-text-field
        v-if="item.recordType === RecordTypeEnums.Local"
        v-model="item.password"
        :type="showPassword[item.id] ? 'text' : 'password'"
        density="compact"
        variant="outlined"
        hide-details
      >
        <template #append-inner>
          <v-icon
            @click="togglePasswordVisibility(item.id)"
            :icon="showPassword[item.id] ? mdiEyeOff : mdiEye"
            size="small"
            class="cursor-pointer"
          />
        </template>
      </v-text-field>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn :icon="mdiDelete" variant="text" color="error" @click="removeAccount(item.id)" />
    </template>
  </v-data-table>
</template> -->
