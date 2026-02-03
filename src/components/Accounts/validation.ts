export interface ValidationRules {
  required?: boolean
  maxLength?: number
  custom?: (value: any) => boolean | string
}

export interface FieldValidation {
  isValid: boolean
  errorMessage: string
}

export const validationConfig = {
  tags: {
    maxLength: 50,
    errorMessages: {
      maxLength: 'Максимальная длина меток - 50 символов'
    }
  },
  login: {
    required: true,
    maxLength: 100,
    errorMessages: {
      required: 'Логин обязателен для заполнения',
      maxLength: 'Максимальная длина логина - 100 символов'
    }
  },
  password: {
    required: false,
    maxLength: 100,
    errorMessages: {
      maxLength: 'Максимальная длина пароля - 100 символов'
    }
  }
} as const

export function validateField(
  value: string | any[],
  rules: { required?: boolean; maxLength?: number },
  errorMessages: Record<string, string>
): FieldValidation {
  const result: FieldValidation = {
    isValid: true,
    errorMessage: ''
  }

  // Проверка на обязательность
  if (rules.required) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      result.isValid = false
      result.errorMessage = errorMessages.required || 'Поле обязательно для заполнения'
      return result
    }
  }

  // Проверка максимальной длины
  if (rules.maxLength) {
    if (typeof value === 'string' && value.length > rules.maxLength) {
      result.isValid = false
      result.errorMessage = errorMessages.maxLength || `Максимальная длина - ${rules.maxLength} символов`
      return result
    }
    
    // Для массива меток проверяем общую длину
    if (Array.isArray(value)) {
      const totalLength = value.reduce((acc, tag) => acc + (tag.text?.length || 0), 0)
      if (totalLength > rules.maxLength) {
        result.isValid = false
        result.errorMessage = errorMessages.maxLength || `Максимальная длина - ${rules.maxLength} символов`
        return result
      }
    }
  }

  return result
}