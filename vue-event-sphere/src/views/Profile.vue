<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from "@/store/userStore.js";
import { useAuthStore } from "@/store/authStore.js";
import SideBar from "@/components/SideBar.vue";
import UpdateRoleModalComponent from "@/components/modal/UpdateRoleModalComponent.vue";
import Swal from "sweetalert2"; // Import the modal component

const activeTab = ref('profile');
const showModal = ref(false); // State to manage modal visibility
const selectedUser = ref(null); // State to manage selected user

const authStore = useAuthStore();
const id = authStore.id; // Get the authenticated user's ID
const userStore = useUserStore();
const users = ref([]);

const user = ref({
  id: id,
  name: '',
  lastName: '',
  email: '',
  password: '',
  roleID: '',
  roleName: '',
});

const fetchUserDetails = async () => {
  try {
    const response = await userStore.getUser(id);
    user.value = response;
  } catch (error) {
    console.error('Error fetching user details:', error.message);
  }
};

const fetchAllUsers = async () => {
  try {
    const response = await userStore.getUsers();
    users.value = response;
  } catch (error) {
    console.error('Error fetching all users:', error.message);
  }
};

const editProfile = async () => {
  try {
    await userStore.updateUser(user.value);
    await Swal.fire({
      title: "User updated successfully!",
      text: "Please login!",
      icon: "success"
    }).then(() => {
      location.reload();
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
  }
};

const deleteUser = async (userId) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      await userStore.deleteUser(userId);
      await Swal.fire({
        title: "User Deleted successfully!",
        icon: "success"
      }).then(() => {
        window.location.reload();
      });
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};

// Open modal and set selected user
const openModal = (user) => {
  selectedUser.value = { ...user }; // Ensure deep copy to avoid mutations
  showModal.value = true;
};

const changeTab = (tab) => {
  activeTab.value = tab;
};

onMounted(async () => {
  await fetchUserDetails();
  await fetchAllUsers();
});
</script>

<template>
  <div class="d-flex">
    <side-bar />
    <div class="container-xl px-4 mt-4">
      <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'profile' }" @click.prevent="changeTab('profile')">Profile</a>
        <a class="nav-link" :class="{ active: activeTab === 'Admin' }" @click.prevent="changeTab('Admin')">Admin</a>
      </nav>
      <hr class="mt-0 mb-4">

      <!-- Profile Tab -->
      <div class="row" v-if="activeTab === 'profile'">
        <div class="col-xl-4">
          <div class="card mb-4 mb-xl-0">
            <div class="card-header">Profile Picture</div>
            <div class="card-body text-center">
              <img class="img-account-profile rounded-circle mb-2" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="">
              <div class="small font-italic text-muted mb-4">{{user.name}} {{user.lastName}}</div>
              <button class="btn btn-primary" type="button">Upload new image</button>
            </div>
          </div>
        </div>
        <div class="col-xl-8">
          <div class="card mb-4">
            <div class="card-header">Account Details</div>
            <div class="card-body">
              <form>
                <div class="row gx-3 mb-3">
                  <div class="col-md-6">
                    <label class="small mb-1" for="inputFirstName">First name</label>
                    <input class="form-control" id="inputFirstName" type="text" placeholder="Enter your first name" v-model="user.name">
                  </div>
                  <div class="col-md-6">
                    <label class="small mb-1" for="inputLastName">Last name</label>
                    <input class="form-control" id="inputLastName" type="text" placeholder="Enter your last name" v-model="user.lastName">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="small mb-1" for="inputEmailAddress">Email address</label>
                  <input class="form-control" id="inputEmailAddress" type="email" placeholder="Enter your email address" v-model="user.email">
                </div>

                <div class="mb-3">
                  <label class="small mb-1" for="inputPassword">Password</label>
                  <input class="form-control" id="inputPassword" type="password" placeholder="Enter your password" v-model="user.password">
                </div>

                <div class="mb-3">
                  <label class="small mb-1" for="inputRole">Role</label>
                  <input class="form-control" id="inputRole" type="text" :disabled="true" v-model="user.roleName">
                </div>

                <button class="btn btn-primary" type="button" @click="editProfile">Save changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Tab -->
      <div v-if="activeTab === 'Admin'">
        <div class="card mb-4">
          <div class="card-header">All Users</div>
          <div class="card-body">
            <table class="table">
              <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.roleName }}</td>
                <td class="text-end">
                  <button class="btn btn-outline-danger btn-sm m-2" :disabled="user.id == id" @click="deleteUser(user.id)">Delete</button>
                  <button class="btn btn-primary btn-sm" :disabled="user.id == id" @click="openModal(user)">
                    Update User Role
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Include the modal component and pass necessary props -->
  <update-role-modal-component :show-modal="showModal" :user="selectedUser" @close="showModal = false" />
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Styles same as provided previously */
</style>
