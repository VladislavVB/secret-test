import { createRouter, createWebHistory } from 'vue-router'

export enum RouterPaths {
  Home = '/',
  CreateForm = '/create-form',
}

export enum RouterNames {
  Home = 'Home',
  CreateForm = 'CreateForm',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RouterPaths.Home,
      name: RouterNames.Home,
      component: () => import('@/views/HomeView.vue'),
    },
    // {
    //   path: RouterPaths.CreateForm,
    //   name: RouterNames.CreateForm,
    //   component: () => import('@/views/CreateForm.vue'),
    // },
  ],
})

export default router
