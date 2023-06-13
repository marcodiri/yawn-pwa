import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/start'
  },
  {
    path: '/start',
    name: 'Start',
    component: () => import('@/views/StartPage.vue')
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: () => import('@/views/ExercisesPage.vue')
  },
  {
    path: '/exercises/:id',
    name: 'ExerciseInfo',
    component: () => import('@/views/ExerciseInfoPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
