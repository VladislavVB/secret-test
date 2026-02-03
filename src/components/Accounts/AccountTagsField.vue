<script setup lang="ts">
import type { AccountInterface, TagsInterface } from '@/types/account.types'
import { validateTags, getAccountErrors } from './accountValidation'
import { useAccountsStore } from '@/stores/accounts'

interface Props {
  account: AccountInterface
}

const props = defineProps<Props>()

const stateAccounts = useAccountsStore()
const validationErrors = stateAccounts.validationErrors

function formatTagsForDisplay(tags: TagsInterface[]): string {
  if (!tags || tags.length === 0) return ''
  return tags.map((tag) => tag.text).join('; ')
}

function handleTagsInput(value: string) {
  const tagsArray = value
    .split(';')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => ({ text: tag }))

  props.account.tags = tagsArray
}

function handleTagsBlur() {
  const error = validateTags(props.account.tags)
  const accountErrors = getAccountErrors(validationErrors, props.account.id)
  if (error) {
    accountErrors.tags = error
  } else {
    delete accountErrors.tags
  }
}
</script>

<template>
  <v-textarea
    :model-value="formatTagsForDisplay(account.tags)"
    @update:model-value="handleTagsInput"
    @blur="handleTagsBlur"
    :error="!!validationErrors[account.id]?.tags"
    :error-messages="validationErrors[account.id]?.tags"
    auto-grow
    rows="1"
    variant="outlined"
    density="compact"
    placeholder="Значение"
    class="full-width"
    :counter="account.tags?.reduce((acc, tag) => acc + (tag.text?.length || 0), 0) || 0"
    :maxlength="50"
  />
</template>

