<script setup lang="ts">
import { useAccountsStore} from '@/stores/accounts'
import { mdiDelete } from '@mdi/js'
import { validatePassword } from './accountValidation'
import { RecordTypeEnums, type AccountInterface } from '@/types/account.types'
import AccountTagsField from './AccountTagsField.vue'
import AccountPasswordField from './AccountPasswordField.vue'
import AccountLoginField from './AccountLoginField.vue'

const stateAccounts = useAccountsStore()
const validationErrors = stateAccounts.validationErrors

const recordTypeOptions = [
  { title: 'Локальная', value: RecordTypeEnums.Local },
  { title: 'LDAP', value: RecordTypeEnums.LDAP },
]

const gridTemplateColumns = 'grid-template-columns: 23% 23% 23% 23% 80px'
const gridTemplateLoginColumns = 'grid-template-columns: 23% 23% 46% 0% 80px'

function removeAccount(accountId: number) {
  if (window.confirm('Удалить?')) {
    stateAccounts.deleteAccount(accountId)
    delete validationErrors[accountId]
  }
}

function handleRecordTypeChange(account: AccountInterface, value: RecordTypeEnums) {
  account.recordType = value

  if (value === RecordTypeEnums.LDAP) {
    account.password = ''
    const accountErrors = validationErrors[account.id]
    if (accountErrors) {
      delete accountErrors.password
    }
  } else {
    const currentPassword = account.password
    const accountErrors = (validationErrors[account.id] ||= {})

    if (currentPassword) {
      const error = validatePassword(currentPassword, value)
      if (error) accountErrors.password = error
      else delete accountErrors.password
    } else accountErrors.password = 'Пароль обязателен'
  }
}
</script>

<template>
  <div class="accounts-container">
    <div class="table-header" :style="gridTemplateColumns">
      <div class="header-cell">Метки</div>
      <div class="header-cell">Тип записи</div>
      <div class="header-cell">Логин</div>
      <div class="header-cell">Пароль</div>
      <div class="header-cell"></div>
    </div>

    <div v-if="stateAccounts.accounts.length === 0" class="empty-state">
      Нет записей
    </div>

    <div v-else class="table-body">
      <div 
        v-for="item in stateAccounts.accounts" 
        :key="item.id" 
        class="table-row"
        :style="item.recordType === RecordTypeEnums.LDAP ? gridTemplateLoginColumns : gridTemplateColumns"
      >
        <div class="body-cell">
          <AccountTagsField :account="item" />
        </div>

        <div class="body-cell">
          <v-select
            :model-value="item.recordType"
            @update:model-value="(val) => handleRecordTypeChange(item, val)"
            :items="recordTypeOptions"
            density="compact"
            variant="outlined"
            hide-details
            class="record-type-select"
          />
        </div>

        <div class="body-cell">
          <AccountLoginField :account="item" />
        </div>

        <div class="body-cell">
          <AccountPasswordField :account="item" />
        </div>

        <div class="body-cell actions-cell">
          <v-btn 
            :icon="mdiDelete" 
            variant="text" 
            color="error" 
            @click="removeAccount(item.id)"
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>