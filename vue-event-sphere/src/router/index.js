import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LogInView from '@/views/auth/LogInView.vue';
import SignUpView from '@/views/auth/SignUpView.vue';
import DetailsView from '@/views/DetailsView.vue';
import TicketsView from '@/views/TicketsView.vue';
import { useAuthStore } from '@/store/authStore.js';
import TicketCard from '@/components/TicketCard.vue';

const routes = [
  {
    path: '/register',
    name: 'register',
    component: SignUpView,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LogInView,
    meta: { requiresAuth: false }
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
    component: () => import('@/views/AboutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/eventdetails/:id',
    name: 'eventdetails',
    component: DetailsView,
    meta: { requiresAuth: true },
  //   children: [
  //     {
  //         path: '/ticket',
  //         name: 'ticket',
  //         component: TicketsView,
        
  //     }
  // ]
  },
  {
    path: '/Ticket/:id/event',
    name: 'tickets',
    component: TicketsView,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  } else if (!to.meta.requiresAuth && authStore.isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    next({
      path: '/',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
