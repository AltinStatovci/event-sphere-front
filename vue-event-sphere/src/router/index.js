import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LogInView from "@/views/auth/LogInView.vue";
import SignUpView from "@/views/auth/SignUpView.vue";
import {useAuthStore} from "@/store/authStore.js";
import Dashboard from "@/views/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component:SignUpView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component:LogInView,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component:Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      name: 'login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  } else if (!to.meta.requiresAuth && authStore.isLoggedIn) {
    return {
      path: '/',
      query: { redirect: to.fullPath },
    }
  }
})

export default router
