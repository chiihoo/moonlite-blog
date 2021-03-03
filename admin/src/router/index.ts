import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('../views/login/login.vue')
  },
  {
    path: '/',
    component: () => import('../views/main/main.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/categories',
        component: () => import('../views/categories/categories.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/categories/create',
        component: () => import('../views/categories/categories-create.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/categories/create/:id',
        component: () => import('../views/categories/categories-create.vue'),
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: '/categories/edit/:id',
        component: () => import('../views/categories/categories-edit.vue'),
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: '/articles',
        component: () => import('../views/articles/articles.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/articles/create',
        component: () => import('../views/articles/articles-create.vue'),
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: '/articles/create/:id',
        component: () => import('../views/articles/articles-create.vue'),
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: '/articles/edit/:id',
        component: () => import('../views/articles/articles-edit.vue'),
        meta: { requiresAuth: true },
        props: true
      }
    ]
  }
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
