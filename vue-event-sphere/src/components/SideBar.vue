<script setup>

</script>


<template>
  <div class="sidebar">
    <div class="sidebar-header">
<!--      <img src="/pow.png" alt="Logo" style="width: 100px; height: 40px;" class="sidebar-logo">-->
    </div>
    <ul class="sidebar-menu">
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/about">About</router-link></li>
      <li><router-link to="/home">Accounts</router-link></li>
    </ul>
  </div>
</template>


<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  margin-top: 4%;
  height: 82vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px;
  background-color: #1a252f;
  text-align: center;
}

.sidebar-logo {
  width: 50px;
  height: auto;
  margin-bottom: 10px;
}

.sidebar-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  width: 100%;
}

.sidebar-menu li a {
  display: block;
  color: #ecf0f1;
  padding: 15px 20px;
  text-decoration: none;
  transition: background 0.3s;
}

.sidebar-menu li a:hover {
  background-color: #34495e;
}
</style>