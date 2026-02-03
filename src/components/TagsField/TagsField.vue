<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AccountInterface, TagsInterface } from '@/stores/accounts'
import { validateField, validationConfig } from '@/components/Accounts/validation'

interface Props {
  modelValue: TagsInterface[]
  accountId: number
}

interface Emits {
  (e: 'update:modelValue', value: TagsInterface[]): void
  (e: 'validation', data: { id: number; field: string; isValid: boolean }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputValue = ref('')
const errorMessage = ref('')

// Форматируем массив меток в строку для отображения
const displayValue = computed(() => {
  if (!props.modelValue || props.modelValue.length === 0) return ''
  return props.modelValue.map(tag => tag.text).join('; ')
})

// Обработчик изменения значения
const handleInput = (value: string) => {
  // Разбиваем строку на метки
  const tagsArray = value
    .split(';')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => ({ text: tag }))

  // Валидация
  const validation = validateField(
    tagsArray,
    { maxLength: validationConfig.tags.maxLength },
    validationConfig.tags.errorMessages
  )

  errorMessage.value = validation.errorMessage
  
  // Отправляем событие валидации
  emit('validation', {
    id: props.accountId,
    field: 'tags',
    isValid: validation.isValid
  })

  // Если валидация прошла, обновляем значение
  if (validation.isValid) {
    emit('update:modelValue', tagsArray)
  }
}

// Инициализируем значение при монтировании
import { onMounted } from 'vue'
onMounted(() => {
  inputValue.value = displayValue.value
})
</script>

<template>
  <div>
    <v-textarea
      :model-value="displayValue"
      @update:model-value="handleInput"
      :error="!!errorMessage"
      :error-messages="errorMessage"
      auto-grow
      rows="1"
      variant="outlined"
      density="compact"
      placeholder="Введите метки через ;"
      class="full-width"
      @blur="handleInput(inputValue)"
    />
    <div v-if="!errorMessage" class="text-caption text-grey">
      {{ errorMessage }}
      Максимум 50 символов
    </div>
  </div>
</template>