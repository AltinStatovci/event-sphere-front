<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useAuthStore } from "@/store/authStore.js";
const authStore = useAuthStore();
const route = useRoute();

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import connection from '@/signalR/useSignalR.js';
import ticketConnection from '@/signalR/signalRTickets.js';

connection.on("ReceiveNotification", (message) => {
  toast.success(message, {

    position: "top-right",

    timeout: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: true,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,

  });
});
ticketConnection.on("ReceiveTicketCountUpdate", (eventId, availableTickets) => {
    console.log(`Event ID: ${eventId}, Available Tickets: ${availableTickets}`);
    window.dispatchEvent(new CustomEvent('ticketUpdate', { detail: { eventId, availableTickets } }));
});

</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav>
      <Header

        v-if="route.name !== 'login' && route.name !== 'notification' && route.name !== 'register' && route.name !== 'dashboard' && route.name !== 'profile' && route.name !== 'paymentDashboard'&& route.name !== 'logs' && route.name !== 'report' && route.name !== 'manageEvent' && route.name !== 'manageTickets' && route.name !== 'managePromoCode'" />

    </nav>

    <div class="app">

      <main>
        <RouterView />
      </main>
    </div>

    <footer>
      <Footer

        v-if="route.name !== 'login' && route.name !== 'register' &&  route.name !== 'dashboard' && route.name !== 'profile' && route.name !== 'paymentDashboard' && route.name !== 'report' && route.name !== 'logs' && route.name !== 'manageTickets' && route.name !== 'manageEvent'" />


    </footer>
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

:root {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}
::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}


::-webkit-scrollbar-track {
  background: transparent;
}


::-webkit-scrollbar-thumb {
  background: black;
}
</style>
