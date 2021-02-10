import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
  }
}

const Login = () => import('../views/login/login.vue')
const Home = () => import('../views/home/home.vue')

const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: Login },
  { path: '/', component: Home, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('access_token')) {
    next('/login')
  }
  next()
})

export default router
