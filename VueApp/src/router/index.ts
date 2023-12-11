import { createRouter, createWebHistory } from 'vue-router'
import MapView from "@/components/views/MapView.vue";
import TableView from "@/components/views/TableView.vue";
import ChartView from "@/components/views/ChartView.vue";
import NotFoundView from "@/components/views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: ['/map'],
      name: 'map',
      component: () => import('@/components/views/MapView.vue')
    },
    {
      path: '/table',
      name: 'table',
      component: () => import('@/components/views/TableView.vue')
    },
    {
      path: '/chart',
      name: 'chart',
      component: () => import('@/components/views/ChartView.vue')
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/components/views/NotFoundView.vue')
    }
  ]
})

router.beforeResolve((to, from, next) => {
  if (to.matched.length === 0) {
    next({ name: '404' });
  } else {
    next();
  }
});

export default router
