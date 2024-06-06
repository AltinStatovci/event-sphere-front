<script setup>
import {useAuthStore} from "@/store/authStore.js";
import {useRouter} from "vue-router";
import DropdownLi from "@/components/DropdownLi.vue";


const authStore = useAuthStore();
const router = useRouter();

function onLogOut() {
  authStore.logOut();
  router.push({name:'login'});
}


const onDashboard = () =>{
  router.push({path:'dashboard'})
};

const onHome = () => {
  router.push({path:'/'});
}
const onAboutUs = () => {
  router.push({path:'/about'});
}
const onContact = () => {
  router.push({path:'/contact'});
}
</script>




<template>

  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">EventSphere</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" @click="onHome">Home</a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" >
              Events
            </a>
            <ul class="dropdown-menu">
              <dropdown-li/>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link active" @click="onAboutUs">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" @click="onContact">Contact</a></li>
        </ul>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown custom-margin-right">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/icons/person-circle.svg" alt="Profile" class="rounded-circle" style="width: 30px; height: 30px;">
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><button class="dropdown-item" @click="onDashboard">DashBoard</button></li>
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
  </style>
