import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import { LocalStorageManager } from '@/utils/localStorage.utils'

export enum RecordTypeEnums {
  Local = 'local',
  LDAP = 'LDAP',
}

export interface TagsInterface {
  text: string
}

interface BaseAccountInterface {
  id: number
  tags: Array<TagsInterface>
  login: string
}

interface LocalAccountInterface extends BaseAccountInterface {
  recordType: RecordTypeEnums.Local
  password: string
}

interface LDAPAccountInterface extends BaseAccountInterface {
  recordType: RecordTypeEnums.LDAP
  password: null
}
export type AccountInterface = LocalAccountInterface | LDAPAccountInterface

export const useAccountsStore = defineStore('accounts', () => {
  const accountsState = reactive<AccountInterface[]>(LocalStorageManager.get('accounts', []))

  watch(
    () => [...accountsState],
    (newAccounts) => {
      LocalStorageManager.set('accounts', newAccounts)
    },
    { deep: true }
  )

  const accounts = computed(() => accountsState)

  function createAccount(account: AccountInterface) {
    accountsState.push(account)
  }

  function deleteAccount(accountId: Number) {
    const index = accountsState.findIndex((acc) => acc.id === accountId)
    if (index !== -1) return accountsState.splice(index, 1)[0]
    return null
  }

  return { accounts, createAccount, deleteAccount }
})
