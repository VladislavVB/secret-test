import { createRouter, createWebHistory } from 'vue-router'

export enum RouterPaths {
  Home = '/',
}

export enum RouterNames {
  Home = 'Home',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RouterPaths.Home,
      name: RouterNames.Home,
      component: () => import('@/views/HomeView.vue'),
    },
  ],
})

export default router
