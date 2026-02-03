<script setup lang="ts">
import { ref, watch } from 'vue'
import { validateField, validationConfig } from '@/components/Accounts/validation'
import { mdiEyeOff, mdiEye } from '@mdi/js'

interface Props {
  modelValue: string
  accountId: number
  recordType: string
  showPassword: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-password-visibility', id: number): void
  (e: 'validation', data: { id: number; field: string; isValid: boolean }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)
const errorMessage = ref('')

// Валидация пароля (только для локального типа)
const validate = (value: string) => {
  if (props.recordType !== 'Local') {
    errorMessage.value = ''
    emit('validation', {
      id: props.accountId,
      field: 'password',
      isValid: true
    })
    return true
  }

  const validation = validateField(
    value,
    { required: true, maxLength: validationConfig.password.maxLength },
    validationConfig.password.errorMessages
  )

  errorMessage.value = validation.errorMessage
  
  emit('validation', {
    id: props.accountId,
    field: 'password',
    isValid: validation.isValid
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

// Обработчик потери фокуса
const handleBlur = () => {
  validate(localValue.value)
}

// Переключение видимости пароля
const toggleVisibility = () => {
  emit('toggle-password-visibility', props.accountId)
}

// Следим за изменениями извне
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
  validate(newValue)
})

// Следим за изменением типа записи
watch(() => props.recordType, () => {
  validate(localValue.value)
})

// Инициализируем валидацию
import { onMounted } from 'vue'
onMounted(() => {
  validate(props.modelValue)
})
</script>

<template>
  <div v-if="recordType === 'Local'">
    <v-text-field
      v-model="localValue"
      @update:model-value="handleInput"
      @blur="handleBlur"
      :type="showPassword ? 'text' : 'password'"
      :error="!!errorMessage"
      :error-messages="errorMessage"
      density="compact"
      variant="outlined"
      :counter="localValue.length > 80"
      :maxlength="validationConfig.password.maxLength"
    >
      <template #append-inner>
        <v-icon
          @click="toggleVisibility"
          :icon="showPassword ? mdiEyeOff : mdiEye"
          size="small"
          class="cursor-pointer"
        />
      </template>
    </v-text-field>
  </div>
  <div v-else class="text-caption text-grey py-2">
    Пароль не требуется для LDAP
  </div>
</template>