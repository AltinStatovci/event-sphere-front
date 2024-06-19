<script setup>
import { useAuthStore } from "@/store/authStore.js";
import { useRouter } from "vue-router";
import DropdownLi from "@/components/DropdownLi.vue";
import Logo from '@/assets/Logo.svg';
import Location from '@/assets/Location.svg';


const authStore = useAuthStore();
const router = useRouter();

function onLogOut() {
  authStore.logOut();
  router.push({ name: 'login' });
}


const onDashboard = () => {
  router.push({ name: 'dashboard' })
};

const onHome = () => {
  router.push({ path: '/' });
}
const onAboutUs = () => {
  router.push({ path: '/about' });
}
const onNearYou = () => {
  router.push({ path: '/nearYou' });
}
</script>




<template>

  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <Logo />
      <a class="navbar-brand title" href="/">EventSphere</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item dropdown">
            <a class="nav-link active dropdown-toggle custom-font-size" href="#" role="button" data-bs-toggle="dropdown">
              Events
            </a>
            <ul class="dropdown-menu">
              <dropdown-li />
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link active custom-font-size" @click="onNearYou" role="button">Near you <Location /> </a>
          </li>
          <li class="nav-item">
            <a class="nav-link active custom-font-size" @click="onAboutUs" role="button">About us</a>
          </li>
        </ul>
        <div class="input-group justify-content-center">
          <div class="form-outline bg-white rounded" data-mdb-input-init>
            <input type="search" id="form1" class="form-control" />
            <label class="form-label" for="form1">Search</label>
          </div>
          <button type="button" class="btn btn-primary" data-mdb-ripple-init>
            <i class="fas fa-search"></i>
          </button>
        </div>
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item dropdown custom-margin-right">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/icons/person-circle.svg" alt="Profile"
                class="rounded-circle" style="width: 30px; height: 30px;">
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><button class="dropdown-item" @click="onDashboard">Dashboard</button></li>
              <li><button class="btn btn-outline-danger btn-sm m-lg-2" @click="onLogOut()">Log Out</button> </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
.custom-margin-right {
  margin-right: 5px;
}

.title {
  font-size: 1.5rem;
  background: -webkit-linear-gradient(45deg,#0f0101, #6b6767);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
}

.custom-font-size {
  font-size: 1.2rem;
}

.navbar {
  background-color: #ECECEC;
}
.navbar-nav{
  flex: none;
}
.form-outline {
  width: 20%;
}

.nav-item {
  padding: 0 0.8rem;
}
.dropdown-item{
  padding-left: 10px;
  font-size: 18px;
}
</style>
