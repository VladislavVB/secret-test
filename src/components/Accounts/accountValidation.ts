import type { AccountInterface, TagsInterface, AccountValidationErrors } from '@/types/account.types'
import { RecordTypeEnums } from '@/types/account.types'

export const validateTags = (tags: TagsInterface[]): string => {
  if (!tags || tags.length === 0) return ''

  const totalLength = tags.reduce((acc, tag) => acc + (tag.text?.length || 0), 0)
  if (totalLength > 50) return 'Максимальная длина 50 символов'

  return ''
}

export const validateLogin = (login: string): string => {
  if (!login || login.trim() === '') return 'Логин обязателен'

  if (login.length > 100) return 'Максимальная длина 100 символов'

  return ''
}

export const validatePassword = (password: string | null, recordType: RecordTypeEnums): string => {
  if (recordType === RecordTypeEnums.LDAP) {
    return ''
  }

  if (!password || password.trim() === '') return 'Пароль обязателен'

  if (password.length > 100) return 'Максимальная длина 100 символов'

  return ''
}

export const validateAccount = (account: AccountInterface): Record<string, string> => {
  const errors: AccountValidationErrors = {}

  const tagsError = validateTags(account.tags)
  if (tagsError) errors.tags = tagsError

  const loginError = validateLogin(account.login)
  if (loginError) errors.login = loginError

  const passwordError = validatePassword(account.password, account.recordType)
  if (passwordError) errors.password = passwordError

  return errors
}

export const getAccountErrors = (
  validationErrors: Record<number, AccountValidationErrors>,
  accountId: number
): AccountValidationErrors => {
  return (validationErrors[accountId] ||= {})
}
