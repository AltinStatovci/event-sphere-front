<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import GuestHeader from './components/GuestHeader.vue';
import {useAuthStore} from "@/store/authStore.js";

const authStore = useAuthStore();
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav>
      <Header v-if="authStore.isLoggedIn"/>
    </nav>

    <main class="flex-fill">
      <RouterView />
    </main>

    <footer>
      <Footer v-if="authStore.isLoggedIn"/>
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



