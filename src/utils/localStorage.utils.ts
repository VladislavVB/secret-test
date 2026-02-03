export class LocalStorageManager {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(error)
      return defaultValue
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(error)
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(error)
    }
  }
}
