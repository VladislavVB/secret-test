// Vuetify 3 для Vue 3
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Тема
const lightTheme = {
  dark: false,
  // colors: {
  //   background: '#797979',
  //   surface: '#1E1E1E',
  //   primary: '#2c5e88',
  //   'primary-darken-1': '#1976D2',
  //   secondary: '#03DAC6',
  //   'secondary-darken-1': '#018786',
  //   error: '#CF6679',
  //   info: '#2196F3',
  //   success: '#4CAF50',
  //   warning: '#FF9800',
  // },
}

const darkTheme = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#2196F3',
    'primary-darken-1': '#1976D2',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#CF6679',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
  },
}

export default createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
    variations: {
      colors: ['primary', 'secondary', 'error'],
      lighten: 4,
      darken: 4,
    },
  },

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },

  defaults: {
    global: {
      ripple: true,
    },
    VBtn: {
      variant: 'flat',
      color: 'primary',
    },
    VTextField: {
      variant: 'outlined',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      color: 'primary',
    },
    VCheckbox: {
      color: 'primary',
    },
    VRadioGroup: {
      color: 'primary',
    },
    VSwitch: {
      color: 'primary',
    },
  },
})