<script setup>
import {useAuthStore} from "@/store/authStore.js";
import {useRouter} from "vue-router";


const authStore = useAuthStore();
const router = useRouter();

function onLogOut() {
  authStore.logOut();
  router.push({name:'login'});
}

</script>




<template>

  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">EventSphere</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" >
              Events
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Sports</a></li>
              <li><a class="dropdown-item" href="#">Concerts</a></li>
              <li><a class="dropdown-item" href="#">OutSide Activities</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled">Contact</a></li>
        </ul>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown custom-margin-right">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/icons/person-circle.svg" alt="Profile" class="rounded-circle" style="width: 30px; height: 30px;">
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#">DashBoard</a></li>
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
