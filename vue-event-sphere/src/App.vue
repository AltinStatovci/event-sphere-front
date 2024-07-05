<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useAuthStore } from "@/store/authStore.js";
const authStore = useAuthStore();
const route = useRoute();


</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav>
      <Header

        v-if="route.name !== 'login' && route.name !== 'register' && route.name !== 'dashboard' && route.name !== 'profile' && route.name !== 'paymentDashboard'&& route.name !== 'logs' && route.name !== 'report' && route.name !== 'manageEvent' && route.name !== 'manageTickets'" />

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
