<script setup>
import { RouterLink, RouterView } from 'vue-router'
<<<<<<< Header-Footer
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
=======

</script>

<template>





  <RouterView />
</template>

<style scoped>

>>>>>>> main
</style>

