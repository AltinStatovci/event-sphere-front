<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useAuthStore } from "@/store/authStore.js";
const authStore = useAuthStore();
const route = useRoute();

// Show sidebar only on the dashboard route
const showSidebar = computed(() => route.name === 'dashboard' || 'profile' || 'payment' || 'report');

// Determine if the current route is the dashboard
const isDashboard = computed(() => route.name === 'dashboard' || route.name === 'profile' || route.name === 'payment' || route.name === 'report');
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav>
      <Header v-if="authStore.isLoggedIn && route.name !== 'dashboard' && route.name !== 'profile' && route.name !== 'payment' && route.name !== 'report'" />
    </nav>

    <div class="app">
      <RouterView name="sidebar" v-if="showSidebar" />
      <main>
        <RouterView />
      </main>
    </div>

    <footer>
      <Footer v-if="authStore.isLoggedIn && route.name !== 'dashboard' && route.name !== 'profile' && route.name !== 'payment' && route.name !== 'report'" />
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

</style>

