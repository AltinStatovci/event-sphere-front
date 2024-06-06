<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import SideBar from "@/components/SideBar.vue";

const user = ref({
  firstName: '',
  lastName: '',
  email: ''
});

const store = useStore();

onMounted(() => {
  fetchUserDetails();
});

const fetchUserDetails = async () => {
  try {
    // Fetch user details from the server
    // Assign fetched user data to the user ref
  } catch (error) {
    console.error('Error fetching user details:', error.message);
  }
};

const editProfile = () => {
  // Redirect or show edit profile form
};

const deleteProfile = () => {
  // Show confirmation modal for profile deletion
};
</script>

<template>

<div class="d-flex">
  <side-bar/>
    <div class="profile">
        <div class="profile-header">
            <h1>Profile Details</h1>
        </div>
        <div class="profile-content">
            <div class="profile-info">
                <div class="info-item">
                    <span class="material-symbols-outlined icon">id_card</span>
                    <div class="info-label">First Name:</div>
                    <div class="info-value">{{ user.firstName }}</div>
                </div>
                <div class="info-item">
                    <span class="material-symbols-outlined icon">id_card</span>
                    <div class="info-label">Last Name:</div>
                    <div class="info-value">{{ user.lastName }}</div>
                </div>
                <div class="info-item">
                    <span class="material-symbols-outlined icon">mail</span>
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ user.email }}</div>
                </div>
            </div>
            <div class="profile-actions">
                <button class="edit-btn" @click="editProfile">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
                <button class="delete-btn" @click="deleteProfile">
                    <i class="fas fa-trash-alt"></i> Delete Profile
                </button>
            </div>
        </div>
    </div>
</div>
</template>



<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.profile {
    padding: 20px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 30%;
    margin: 20px auto;
}

.profile-header {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
}

.profile-content {
    display: flex;
    flex-direction: column;
}

.profile-info {
    margin-bottom: 20px;
}

.info-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.info-icon {
    font-size: 20px;
    margin-right: 10px;
    color: #4CAF50;
}

.info-label {
    font-weight: bold;
    min-width: 100px;
}

.info-value {
    margin-left: 10px;
    color: #555;
}

.profile-actions {
    display: flex;
    justify-content: space-between;
}

.edit-btn,
.delete-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
}

.edit-btn {
    background-color: #4CAF50;
    color: white;
}

.delete-btn {
    background-color: #f44336;
    color: white;
}

.edit-btn:hover {
    background-color: #45a049;
}

.delete-btn:hover {
    background-color: #e41f1f;
}

.edit-btn i,
.delete-btn i {
    margin-right: 8px;
}
</style>