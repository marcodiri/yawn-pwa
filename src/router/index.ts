import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/plan/current'
  },
  {
    path: '/plan/:page',
    name: 'Plan',
    component: () => import ('@/views/PlanPage.vue')
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: () => import ('@/views/ExercisesPage.vue')
  },
  {
    path: '/exercises/:id',
    name: 'ExerciseInfo',
    component: () => import ('@/views/ExerciseInfoPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
