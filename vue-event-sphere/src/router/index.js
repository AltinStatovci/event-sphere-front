import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LogInView from '@/views/auth/LogInView.vue';
import SignUpView from '@/views/auth/SignUpView.vue';
import DetailsView from '@/views/DetailsView.vue';
import TicketsView from '@/views/TicketsView.vue';
import { useAuthStore } from '@/store/authStore.js';

import EventByCategoryView from "@/views/EventByCategoryView.vue";
import AboutView from '@/views/AboutView.vue';

import Dashboard from "@/views/Dashboard.vue";

import Profile from "@/views/Profile.vue";
import Payment from "@/views/Payment.vue";
import Report from "@/views/Report.vue";

import PaymentPage from '@/views/PaymentPageView.vue';
import CreateEventView from "@/views/CreateEventView.vue";
import NearYouView from '@/views/NearYouView.vue';
import CreateTicketView from "@/views/CreateTicketView.vue";
import LogsView from "@/views/LogsView.vue";
import NotificationView from "@/views/NotificationView.vue";



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
    meta: { requiresAuth: false }
  },
  {
    path: '/:id',
    name: 'eventByCategory',
    component: EventByCategoryView,
    meta: { requiresAuth: false }
  },
  {
    path: '/eventdetails/:id',
    name: 'eventdetails',
    component: DetailsView,
    meta: { requiresAuth: false },
  },
  {
    path: '/Ticket/:id/event',
    name: 'tickets',
    component: TicketsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { requiresAuth: false}
  },
  {
    path: '/nearYou',
    name: 'nearYou',
    component: NearYouView,
    meta: { requiresAuth: false}
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresAdmin:true },
  },
  {
    path: '/manageEvent',
    name: 'manageEvent',
    component: CreateEventView,
    meta: { requiresAuth: true , requiresAdminOrOrganizer:true},
  },
  {
    path: '/manageTickets',
    name: 'manageTickets',
    component: CreateTicketView,
    meta: { requiresAuth: true , requiresAdmin: true},
  },

  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/report',
    name: 'report',
    component:Report,
    meta: { requiresAuth: true },
  },

  {
    path: '/payment/:id',
    name: 'payment',
    component: PaymentPage,
    meta: { requiresAuth: true }
  },

  {
    path: '/createEvent',
    name: 'createEvent',
    component:CreateEventView,
    meta: { requiresAuth: true, requiresAdminOrOrganizer: true },
  },

  {
    path: '/paymentDashboard',
    name: 'paymentDashboard',
    component:Payment,
    meta: { requiresAuth: true },
  },
  {
    path: '/logs',
    name: 'logs',
    component:LogsView,
    meta: { requiresAuth: true , requiresAdmin: true},
  },
  {
    path: '/notifications',
    name: 'notifications',
    component:NotificationView,

  }
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
    const requiresAdmin = to.meta.requiresAdmin || false;
    const requiresOrganizer = to.meta.requiresOrganizer || false;
    const requiresAdminOrOrganizer = to.meta.requiresAdminOrOrganizer || false;

    if (requiresAdmin && !authStore.isAdmin) {
      next({
        path: '/',
        query: { redirect: to.fullPath },
      });
    } else if (requiresOrganizer && !authStore.isOrganizer) {
      next({
        path: '/',
        query: { redirect: to.fullPath },
      });
    } else if (requiresAdminOrOrganizer && !(authStore.isAdmin || authStore.isOrganizer)) {
      next({
        path: '/',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  }
});

export default router;
