<script setup>
import { ref } from 'vue'
import { useAuthStore } from "@/store/authStore.js";
import { useRouter } from "vue-router";


const is_expanded = ref(localStorage.getItem("is_expanded") === "true")
const showLogout = ref(false)

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
  localStorage.setItem("is_expanded", is_expanded.value)
}

const toggleLogout = () => {
  showLogout.value = !showLogout.value
}
const authStore = useAuthStore();
const router = useRouter();
function onLogOut() {
  authStore.logOut();
  router.push({ name: 'login' });
}

const handleLogout = () => {
  // Implement your logout logic here
  console.log('User logged out')
  // Add your logout functionality here, e.g., clearing tokens, redirecting to login page, etc.
}
</script>


<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="logo">
      <span class="material-icons" style="font-size: 3rem;">data_thresholding</span>
    </div>

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons">keyboard_double_arrow_right</span>
      </button>
    </div>

    <h3>Menu</h3>
    <div class="menu">
      <router-link to="/dashboard" class="button">
        <span class="material-icons">menu</span>
        <span class="text">Dashboard</span>
      </router-link>

      <router-link to="/profile" class="button">
        <span class="material-icons">manage_accounts</span>
        <span class="text">Manage Account</span>
      </router-link>

      <router-link to="/manageEvent" class="button">
        <span class="material-icons">stadium</span>
        <span class="text">Manage Events</span>
      </router-link>

      <router-link to="/paymentDashboard" class="button">
        <span class="material-icons">wallet</span>
        <span class="text">Payments</span>
      </router-link>
      <router-link to="/report" class="button">
        <span class="material-icons">
          report
        </span>
        <span class="text">Report</span>
      </router-link>



      <router-link to="/" class="button">
        <span class="material-icons">home</span>
        <span class="text">Go Home</span>
      </router-link>
    </div>

    <div class="flex"></div>

    <div class="menu">
      <button @click="toggleLogout" class="button">
        <span class="material-icons">settings</span>
        <span class="text">Settings</span>
      </button>
      <span v-if="showLogout" class="logout-button">
        <button @click="onLogOut" class="button">
          <span class="material-icons" style="color: red;">logout</span>
          <span class="text" style="color: red;">Logout</span>
        </button>
      </span>
    </div>
  </aside>
</template>



<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;

  background-color: var(--dark);
  color: var(--light);

  width: calc(3rem + 32px);
  overflow: hidden;
  height: 100vh;
  padding: 1rem;

  transition: 0.2s ease-in-out;

  .flex {
    flex: 1 1 0%;
  }

  .logo {
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
  }


  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;

    position: relative;
    top: 0;
    transition: 0.2s ease-in-out;

    .menu-toggle {
      transition: 0.2s ease-in-out;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      transition: 0.2s ease-in-out;
      padding: 0.5rem 1rem;
      width: 100%;
      /* Ensure button spans entire width */

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-in-out;
      }

      .text {
        color: var(--light);
        transition: 0.2s ease-in-out;
        margin-left: 0.5rem;
        /* Adjust margin to create space between icon and text */
      }

      &:hover {
        background-color: var(--dark-alt);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }

      &.router-link-exact-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--primary);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }
    }
  }

  .logout-button {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      width: 100%;
      /* Ensure button spans entire width */

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-in-out;
      }

      .text {
        color: var(--light);
        transition: 0.2s ease-in-out;
        margin-left: 0.5rem;
        /* Adjust margin to create space between icon and text */
      }

      &:hover {
        background-color: var(--dark-alt);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }
    }
  }

  .footer {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    p {
      font-size: 0.875rem;
      color: var(--grey);
    }
  }

  &.is-expanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      top: -3rem;

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button .text {
      opacity: 1;
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }

    .footer {
      opacity: 0;
    }
  }

  @media (max-width: 1024px) {
    position: absolute;
    z-index: 99;
  }
}
</style>
