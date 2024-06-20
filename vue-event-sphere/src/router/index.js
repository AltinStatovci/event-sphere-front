import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LogInView from '@/views/auth/LogInView.vue';
import SignUpView from '@/views/auth/SignUpView.vue';
import DetailsView from '@/views/DetailsView.vue';
import TicketsView from '@/views/TicketsView.vue';
import { useAuthStore } from '@/store/authStore.js';
import TicketCard from '@/components/TicketCard.vue';
import EventByCategoryView from "@/views/EventByCategoryView.vue";
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/NearYouView.vue';
import Dashboard from "@/views/Dashboard.vue";
import SideBar from "@/components/SideBar.vue";
import Profile from "@/views/Profile.vue";
import Payment from "@/views/Payment.vue";
import Report from "@/views/Report.vue";

import PaymentPage from '@/views/PaymentPageView.vue';
import CreateEventView from "@/views/CreateEventView.vue";
import NearYouView from '@/views/NearYouView.vue';
import CreateTicketView from "@/views/CreateTicketView.vue";



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
    path: '/:id',
    name: 'eventByCategory',
    component: EventByCategoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/eventdetails/:id',
    name: 'eventdetails',
    component: DetailsView,
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true }
  },
  {
    path: '/nearYou',
    name: 'nearYou',
    component: NearYouView,
    meta: { requiresAuth: true }
  },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/manageEvent',
      name: 'manageEvent',
      component: CreateEventView,
      meta: { requiresAuth: true },
    },
    {
      path: '/manageTickets',
      name: 'manageTickets',
      component: CreateTicketView,
      meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  }, 
  {
    path: '/createTickets',
    name: 'createTickets',
    component:CreateTicketView,
    meta: { requiresAuth: true },
  },
 {
  path: '/paymentDashboard',
  name: 'paymentDashboard',
  component:Payment,
  meta: { requiresAuth: true },
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
    next();
  }
});

export default router;
