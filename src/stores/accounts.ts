import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import { LocalStorageManager } from '@/utils/localStorage.utils'
import type { AccountInterface, AccountValidationErrors } from '@/types/account.types'


export const useAccountsStore = defineStore('accounts', () => {
  const accountsState = reactive<AccountInterface[]>(LocalStorageManager.get('accounts', []))
  const validationErrors = reactive<Record<number, AccountValidationErrors>>({})

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

  function deleteAccount(accountId: number) {
    const index = accountsState.findIndex((acc) => acc.id === accountId)
    if (index !== -1) return accountsState.splice(index, 1)[0]
    return null
  }

  return { accounts, createAccount, deleteAccount, validationErrors }
})
