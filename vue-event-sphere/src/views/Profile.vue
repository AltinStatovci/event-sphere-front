<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from "@/store/userStore.js";
import { useAuthStore } from "@/store/authStore.js";
import SideBar from "@/components/SideBar.vue";
import UpdateRoleModalComponent from "@/components/modal/UpdateRoleModalComponent.vue";
import Swal from "sweetalert2";

const activeTab = ref('profile');
const showModal = ref(false);
const selectedUser = ref(null);

const authStore = useAuthStore();
const id = authStore.id;
const userStore = useUserStore();
const users = ref([]);

const password = ref({
  currentPassword: '',
  newPassword: ''
});

const confirmPassword = ref('')

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const user = ref({
  id: id,
  name: '',
  lastName: '',
  email: '',
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

const changePassword = async () => {
  if (password.value.newPassword !== confirmPassword.value) {
    await Swal.fire({
      title: "Error!",
      text: "New Password and Confirm Password do not match.",
      icon: "error"
    });
    return;
  }

  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to change the user's password.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!"
    });

    if (result.isConfirmed) {
      await userStore.updateUserPassword(id, password.value);
      await Swal.fire({
        title: "Password changed successfully!",
        icon: "success"
      }).then(() => {
        window.location.reload();
      });
    }
  } catch (error) {
    console.error('Failed to change user password:', error);
    await Swal.fire({
      title: "Error!",
      text: "Old Password incorrect.",
      icon: "error"
    });
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

const openModal = (user) => {
  selectedUser.value = { ...user };
  showModal.value = true;
};

const changeTab = (tab) => {
  activeTab.value = tab;
};

const toggleCurrentPasswordVisibility = () => {
  showCurrentPassword.value = !showCurrentPassword.value;
};

const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
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
        <a class="nav-link" :class="{ active: activeTab === 'changePassword' }" @click.prevent="changeTab('changePassword')">Change Password</a>
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
                  <label class="small mb-1" for="inputRole">Role</label>
                  <input class="form-control" id="inputRole" type="text" :disabled="true" v-model="user.roleName">
                </div>

                <button class="btn btn-primary" type="button" @click="editProfile">Save changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>


      <div class="row justify-content-center" v-if="activeTab === 'changePassword'">
        <div class="col-xl-10">
          <div class="card mb-4">
            <div class="card-header">Change Password</div>
            <div class="card-body">
              <form>
                <div class="mb-3 position-relative">
                  <label class="small mb-1" for="oldPassword">Old Password</label>
                  <div class="input-group">
                    <input class="form-control" :type="showCurrentPassword ? 'text' : 'password'" id="oldPassword" placeholder="Enter your old password" v-model="password.currentPassword">
                    <button type="button" class="btn btn-outline-white" @click="toggleCurrentPasswordVisibility">
                      <i class="bi" :class="showCurrentPassword ? 'bi-eye-slash text-primary' : 'bi-eye text-primary'"></i>
                    </button>
                  </div>
                </div>
                <div class="mb-3 position-relative">
                  <label class="small mb-1" for="newPassword">New Password</label>
                  <div class="input-group">
                    <input class="form-control" :type="showNewPassword ? 'text' : 'password'" id="newPassword" placeholder="Enter your new Password" v-model="password.newPassword">
                    <button type="button" class="btn btn-outline-white" @click="toggleNewPasswordVisibility">
                      <i class="bi" :class="showNewPassword ? 'bi-eye-slash text-primary' : 'bi-eye text-primary'"></i>
                    </button>
                  </div>
                </div>

                <div class="mb-3 position-relative">
                  <label class="small mb-1" for="confirmPassword">Confirm Password</label>
                  <div class="input-group">
                    <input class="form-control" :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" placeholder="Enter your new Password" v-model="confirmPassword">
                    <button type="button" class="btn btn-outline-white" @click="toggleConfirmPasswordVisibility">
                      <i class="bi" :class="showConfirmPassword ? 'bi-eye-slash text-primary' : 'bi-eye text-primary'"></i>
                    </button>
                  </div>
                </div>

                <button class="btn btn-outline-primary btn-sm" type="button" @click="changePassword">Save</button>
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


  <update-role-modal-component :show-modal="showModal" :user="selectedUser" @close="showModal = false" />
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.img-account-profile{
  width: 60%;
}

.btn{
  text-transform: capitalize;
}


.nav-borders .nav-link.active {
  color: #0061f2;
  border-bottom-color: #0061f2;
}

.nav-borders .nav-link {
  color: #69707a;
  border-bottom-width: 0.125rem;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0;
  padding-right: 0;
  margin-left: 1rem;
  margin-right: 1rem;
  cursor: pointer;
}
</style>
