<script setup lang="ts">
import { RecordTypeEnums, useAccountsStore, type AccountInterface, type TagsInterface } from '@/stores/accounts'
import { mdiEyeOff, mdiEye, mdiDelete } from '@mdi/js'
import { ref, computed, watch } from 'vue'

const headers = ref([
  { title: 'Метки', key: 'tags', width: '25%' },
  { title: 'Тип записи', key: 'recordType', width: '25%' },
  { title: 'Логин', key: 'login', width: '25%' },
  { title: 'Пароль', key: 'password', width: '25%' },
  { title: '', key: 'actions' },
])

const stateAccounts = useAccountsStore()
const showPassword = ref<Record<number, boolean>>({})

// Состояния валидации для каждого поля
const validationErrors = ref<Record<number, Record<string, string>>>({})

const togglePasswordVisibility = (id: number) => {
  showPassword.value[id] = !showPassword.value[id]
}

const recordTypeOptions = [
  { title: 'Локальная', value: RecordTypeEnums.Local },
  { title: 'LDAP', value: RecordTypeEnums.LDAP },
]

// Функции валидации
const validateTags = (tags: TagsInterface[]): string => {
  if (!tags || tags.length === 0) return ''

  // Проверяем общую длину всех меток
  const totalLength = tags.reduce((acc, tag) => acc + (tag.text?.length || 0), 0)
  if (totalLength > 50) {
    return 'Максимальная общая длина всех меток - 50 символов'
  }

  // Проверяем каждую метку отдельно
  for (const tag of tags) {
    if (tag.text && tag.text.length > 50) {
      return 'Каждая метка не должна превышать 50 символов'
    }
  }

  return ''
}

const validateLogin = (login: string): string => {
  if (!login || login.trim() === '') {
    return 'Логин обязателен для заполнения'
  }

  if (login.length > 100) {
    return 'Максимальная длина логина - 100 символов'
  }

  return ''
}

const validatePassword = (password: string | null, recordType: RecordTypeEnums): string => {
  // Если тип записи LDAP - пароль не проверяем
  if (recordType === RecordTypeEnums.LDAP) {
    return ''
  }

  // Для локальной записи проверяем пароль
  if (!password || password.trim() === '') {
    return 'Пароль обязателен для локальной записи'
  }

  if (password.length > 100) {
    return 'Максимальная длина пароля - 100 символов'
  }

  return ''
}

// Общая валидация для аккаунта
const validateAccount = (account: AccountInterface): Record<string, string> => {
  const errors: Record<string, string> = {}

  const tagsError = validateTags(account.tags)
  if (tagsError) errors.tags = tagsError

  const loginError = validateLogin(account.login)
  if (loginError) errors.login = loginError

  const passwordError = validatePassword(account.password, account.recordType)
  if (passwordError) errors.password = passwordError

  return errors
}

// Проверка, можно ли добавить новую запись
const canAddNewAccount = computed(() => {
  // Если нет записей, можно добавить
  if (stateAccounts.accounts.length === 0) return true

  // Проверяем последнюю запись (гарантированно существует, так как длина > 0)
  const lastAccount = stateAccounts.accounts[stateAccounts.accounts.length - 1]!
  const errors = validateAccount(lastAccount)
  // Если нет ошибок, можно добавить новую
  return Object.keys(errors).length === 0
})

function addNewAccount() {
  if (!canAddNewAccount.value) {
    alert('Пожалуйста, исправьте ошибки в текущей записи перед добавлением новой')
    return
  }

  const newAccount = {
    id: Date.now(), // Используем Date.now() вместо getMilliseconds для уникальности
    tags: [],
    login: '',
    recordType: RecordTypeEnums.LDAP,
    password: null, // Для LDAP по умолчанию null
  } as AccountInterface

  stateAccounts.createAccount(newAccount)

  // Инициализируем состояние валидации для новой записи
  validationErrors.value[newAccount.id] = {}
}

function removeAccount(accountId: number) {
  stateAccounts.deleteAccount(accountId)
  delete validationErrors.value[accountId]
  delete showPassword.value[accountId]
}

function handleTagsInput(account: AccountInterface, value: string) {
  const tagsArray = value
    .split(';')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => ({ text: tag }))

  account.tags = tagsArray

  // Валидация после изменения
  const error = validateTags(tagsArray)
  const accountErrors = (validationErrors.value[account.id] ||= {})
  if (error) {
    accountErrors.tags = error
  } else {
    delete accountErrors.tags
  }
}

function formatTagsForDisplay(tags: TagsInterface[]): string {
  if (!tags || tags.length === 0) return ''
  return tags.map((tag) => tag.text).join('; ')
}

// Обработчики изменений полей с валидацией
function handleLoginChange(account: AccountInterface, value: string) {
  account.login = value

  const error = validateLogin(value)
  const accountErrors = (validationErrors.value[account.id] ||= {})
  if (error) {
    accountErrors.login = error
  } else {
    delete accountErrors.login
  }
}

function handlePasswordChange(account: AccountInterface, value: string) {
  account.password = value

  const error = validatePassword(value, account.recordType)
  const accountErrors = (validationErrors.value[account.id] ||= {})
  if (error) {
    accountErrors.password = error
  } else {
    delete accountErrors.password
  }
}

function handleRecordTypeChange(account: AccountInterface, value: RecordTypeEnums) {
  account.recordType = value

  // Если меняем на LDAP, очищаем пароль и ошибки валидации пароля
  if (value === RecordTypeEnums.LDAP) {
    account.password = ''
    const accountErrors = validationErrors.value[account.id]
    if (accountErrors) {
      delete accountErrors.password
    }
  } else {
    // Если меняем на Local, валидируем текущий пароль
    const currentPassword = account.password
    const accountErrors = (validationErrors.value[account.id] ||= {})

    if (currentPassword) {
      const error = validatePassword(currentPassword, value)
      if (error) {
        accountErrors.password = error
      } else {
        delete accountErrors.password
      }
    } else {
      // Если пароль пустой, устанавливаем ошибку
      accountErrors.password = 'Пароль обязателен для локальной записи'
    }
  }
}

// Следим за изменениями в аккаунтах для валидации
watch(
  () => stateAccounts.accounts,
  () => {
    // Валидируем все аккаунты при изменении
    stateAccounts.accounts.forEach((account) => {
      const errors = validateAccount(account)
      if (Object.keys(errors).length > 0) {
        validationErrors.value[account.id] = errors
      } else {
        validationErrors.value[account.id] = {}
      }
    })
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="accounts-container">
    <div class="mb-4">
      <v-btn color="primary" @click="addNewAccount" :disabled="!canAddNewAccount" prepend-icon="mdi-plus">
        Добавить запись
      </v-btn>
      <div v-if="!canAddNewAccount" class="text-caption text-error mt-1">
        Исправьте ошибки в текущей записи перед добавлением новой
      </div>
    </div>

    <v-data-table :headers="headers" :items="stateAccounts.accounts" hide-default-footer>
      <template v-slot:item.tags="{ item }">
        <v-textarea
          :model-value="formatTagsForDisplay(item.tags)"
          @update:model-value="(val) => handleTagsInput(item, val)"
          :error="!!validationErrors[item.id]?.tags"
          :error-messages="validationErrors[item.id]?.tags"
          auto-grow
          rows="1"
          variant="outlined"
          density="compact"
          placeholder="Введите метки через ;"
          class="full-width"
          :counter="item.tags?.reduce((acc, tag) => acc + (tag.text?.length || 0), 0) || 0"
          :maxlength="50"
        />
      </template>

      <template v-slot:item.recordType="{ item }">
        <v-select
          :model-value="item.recordType"
          @update:model-value="(val) => handleRecordTypeChange(item, val)"
          :items="recordTypeOptions"
          density="compact"
          variant="outlined"
          hide-details
        />
      </template>

      <template v-slot:item.login="{ item }">
        <v-text-field
          :model-value="item.login"
          @update:model-value="(val) => handleLoginChange(item, val)"
          :error="!!validationErrors[item.id]?.login"
          :error-messages="validationErrors[item.id]?.login"
          density="compact"
          variant="outlined"
          :maxlength="100"
          :counter="item.login?.length || 0"
        />
      </template>

      <template v-slot:item.password="{ item }">
        <div v-if="item.recordType === RecordTypeEnums.Local">
          <v-text-field
            :model-value="item.password || ''"
            @update:model-value="(val) => handlePasswordChange(item, val)"
            :type="showPassword[item.id] ? 'text' : 'password'"
            :error="!!validationErrors[item.id]?.password"
            :error-messages="validationErrors[item.id]?.password"
            density="compact"
            variant="outlined"
            :maxlength="100"
            :counter="item.password?.length || 0"
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
        </div>
        <div v-else class="text-caption text-grey py-2">Пароль не требуется для LDAP</div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          :icon="mdiDelete"
          variant="text"
          color="error"
          @click="removeAccount(item.id)"
          :disabled="stateAccounts.accounts.length <= 1"
        />
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>
.accounts-container {
  margin: 20px 0;
}

.cursor-pointer {
  cursor: pointer;
}

.full-width {
  width: 100%;
}
</style>
