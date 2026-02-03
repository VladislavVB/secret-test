<script setup lang="ts">
import { ref, watch } from 'vue'
import { validateField, validationConfig } from '@/components/Accounts/validation'

interface Props {
  modelValue: string
  accountId: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'validation', data: { id: number; field: string; isValid: boolean }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)
const errorMessage = ref('')

// Валидация при изменении значения
const validate = (value: string) => {
  const validation = validateField(
    value,
    { required: validationConfig.login.required, maxLength: validationConfig.login.maxLength },
    validationConfig.login.errorMessages
  )

  errorMessage.value = validation.errorMessage

  emit('validation', {
    id: props.accountId,
    field: 'login',
    isValid: validation.isValid,
  })

  return validation.isValid
}

// Обработчик изменения значения
const handleInput = (value: string) => {
  localValue.value = value
  if (validate(value)) {
    emit('update:modelValue', value)
  }
}

// Валидация при потере фокуса
const handleBlur = () => {
  validate(localValue.value)
}

// Следим за изменениями извне
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
    validate(newValue)
  }
)

// Инициализируем валидацию
import { onMounted } from 'vue'
onMounted(() => {
  validate(props.modelValue)
})
</script>

<template>
  <v-text-field
    v-model="localValue"
    @update:model-value="handleInput"
    @blur="handleBlur"
    :error="!!errorMessage"
    :error-messages="errorMessage"
    density="compact"
    variant="outlined"
    :counter="localValue.length > 80"
    :maxlength="validationConfig.login.maxLength"
  />
</template>
