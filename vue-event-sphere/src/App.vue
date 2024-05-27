<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import GuestHeader from './components/GuestHeader.vue';
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav>
      <GuestHeader/>
    </nav>

    <main class="flex-fill">
      <RouterView />
    </main>

    <footer>
      <Footer/>
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

