<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useAuthStore } from "@/store/authStore.js";
const authStore = useAuthStore();
const route = useRoute();

// Show header and footer for all routes except dashboard
const showHeaderAndFooter = computed(() => route.name !== 'dashboard' && route.name !== 'profile' && route.name !== 'payment' && route.name !== 'report');

// Show sidebar only on the dashboard route
const showSidebar = computed(() => route.name === 'dashboard' || 'profile' || 'payment' || 'report');

// Determine if the current route is the dashboard
const isDashboard = computed(() => route.name === 'dashboard' || route.name === 'profile' || route.name === 'payment' || route.name === 'report');
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav v-if="showHeaderAndFooter">
      <Header v-if="authStore.isLoggedIn" />
    </nav>

    <div class="app">
      <RouterView name="sidebar" v-if="showSidebar" />
      <main
        :class="['flex-fill', { 'dashboard-background': isDashboard, 'profile-background': isDashboard, 'payment-background': isDashboard, 'report-background': isDashboard },]">
        <RouterView />
      </main>
    </div>

    <footer v-if="showHeaderAndFooter">
      <Footer v-if="authStore.isLoggedIn" />
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

.dashboard-background {
  background-color: #3fa387;
  /* The green color you want for the dashboard */
}
</style>

<style lang="scss">
:root {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;

  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
  }
}
</style>
