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
const onProfile = () => {
  router.push({ name: 'profile' })
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
const onLogin = () => {
  router.push({ path: '/login' });
}
const onSignup = () => {
  router.push({ path: '/register' });
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
            <a class="nav-link active dropdown-toggle custom-font-size" href="#" role="button"
              data-bs-toggle="dropdown">
              Events
            </a>
            <ul class="dropdown-menu">
              <dropdown-li />
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link active custom-font-size" @click="onNearYou" role="button">Near you
              <Location />
            </a>
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
        <div>
          <ul class="navbar-nav mb-2 mb-lg-0" v-if="authStore.loggedInUser">
            <li class="nav-item dropdown custom-margin-right">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="bi bi-person-circle"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="authStore.isAdmin"><button class="dropdown-item" @click="onDashboard">Dashboard</button></li>
                <li v-else ><button class="dropdown-item" @click="onProfile">My Profile</button></li>
                <li><button class="btn btn-outline-danger btn-sm m-lg-2" @click="onLogOut()">Log Out</button> </li>
              </ul>
            </li>
          </ul>
          <div v-if="!authStore.loggedInUser" class="d-flex">
          <button class="auth-btn btn" @click="onLogin">Log in</button>
          <button class="auth-btn btn btn-primary" @click="onSignup">Sign up</button>
        </div>
        </div>
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
  background: -webkit-linear-gradient(45deg, #0f0101, #6b6767);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.custom-font-size {
  font-size: 1.2rem;
}

.navbar {
  background-color: #ECECEC;
}

.navbar-nav {
  flex: none;
}

.form-outline {
  width: 20%;
}

.nav-item {
  padding: 0 0.8rem;
}

.dropdown-item {
  padding-left: 10px;
  font-size: 18px;
}
.auth-btn{
  text-transform: capitalize;
  width: 100px;
  margin-right: 10px;
}
.bi-person-circle{
  font-size: 30px;
  color: #1e1f22;
}
</style>
