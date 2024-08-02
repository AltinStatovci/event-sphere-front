<script setup>
import { useAuthStore } from "@/store/authStore.js";
import { useRouter } from "vue-router";
import DropdownLi from "@/components/DropdownLi.vue";
import Location from "@/assets/Location.svg";
import { useEventStore } from "@/store/eventStore";
import Notification from '@/components/Notification.vue';
import { ref, watch } from "vue";

const eventStore = useEventStore();
const authStore = useAuthStore();
const router = useRouter();
const eventbyname = ref([]);
const eventname = ref("");

function onLogOut() {
  authStore.logOut();
  router.push({ name: "login" });
}

const onDashboard = () => {
  router.push({ name: "dashboard" });
};
const onProfile = () => {
  router.push({ name: "profile" });
};

const onHome = () => {
  router.push({ path: "/" });
};
const onAboutUs = () => {
  router.push({ path: "/about" });
};
const onRecommend = () => {
  router.push({ path: "/RecomandEvent" });
};
const onNearYou = () => {
  router.push({ path: "/nearYou" });
};
const onLogin = () => {
  router.push({ path: "/login" });
};
const onSignup = () => {
  router.push({ path: "/register" });
};

const getEventsByName = async (name) => {
  try {
    const response = await eventStore.getEventsByName(name);
    eventbyname.value = response;
  } catch (err) {
    console.error(err);
  }
};

const toEventDetails = async (eventId) => {
  router.push({
    path: `/eventdetails/${eventId}`
  }).then(() => {
    location.reload();
  });
}

watch(eventname, (newValue) => {
  if (newValue) {
    getEventsByName(newValue);
  } else {
    eventbyname.value = [];
  }
});
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <img src="../assets/Logo1.png" width="60px" height="60px">
      <a class="navbar-brand title" href="/">EventSphere</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item dropdown">
            <a class="nav-link active dropdown-toggle custom-font-size" href="#" role="button"
              data-bs-toggle="dropdown">
              Events
            </a>
            <ul class="dropdown-menu">
              <DropdownLi />
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
          <li class="nav-item">
            <a class="nav-link active custom-font-size" @click="onRecommend" role="button">RecommendEvent</a>
          </li>
        </ul>
        <div class="search-container input-group justify-content-center position-relative">
          <div class="form-outline bg-white rounded">
            <form @submit.prevent="getEventsByName(eventname)">
              <input type="search" id="form1" class="form-control" v-model="eventname" />
              <label class="form-label" for="form1">Search</label>
            </form>
          </div>
          <button type="button" class="btn btn-primary" @click="getEventsByName(eventname)">
            <i class="fas fa-search"></i>
          </button>
          <ul class="dropdown-menu show search-dropdown" v-if="eventbyname.length">
            <li v-for="event in eventbyname" :key="event.id">
              <a class="dropdown-item" @click="toEventDetails(event.id)">
                <strong>Event :</strong> {{ event.eventName }}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <ul class="navbar-nav mb-2 mb-lg-0" v-if="authStore.loggedInUser">
            <li class="nav-item custom-margin-right">
              <i class="fas fa-bell mt-3" @click="$refs.notification.toggleNotifications()"
                style="font-size: 1.7rem;"></i>
              <Notification ref="notification" />
            </li>
            <li class="nav-item dropdown custom-margin-right">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="authStore.isAdmin">
                  <button class="dropdown-item" @click="onDashboard">
                    Dashboard
                  </button>
                </li>
                <li v-else>
                  <button class="dropdown-item" @click="onProfile">
                    My Profile
                  </button>
                </li>
                <li>
                  <button class="dropdown-item" @click="onLogOut()">
                    Log Out
                    <i class=" ml-2 bi bi-box-arrow-right"></i>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
          <div v-if="!authStore.loggedInUser" class="d-flex">
            <button class="auth-btn btn" @click="onLogin">Log in</button>
            <button class="auth-btn btn btn-primary" @click="onSignup">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
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
  background-color: #ececec;
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

.auth-btn {
  text-transform: capitalize;
  width: 100px;
  margin-right: 10px;
}

.bi-person-circle {
  font-size: 30px;
  color: #1e1f22;
}

.bi-bell {
  font-size: 30px;
  color: #1e1f22;
}

.ml-2 {
  margin-left: 3px;
  font-size: 16px;
}

.dropdown-menu {
  --bs-dropdown-link-active-bg: #f8f9fa;
  --bs-dropdown-link-active-color: #6c757d;
}

.search-container {
  position: relative;
}

.search-dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  width: 25%;
  z-index: 1000;
  top: 100%;
  margin-top: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
