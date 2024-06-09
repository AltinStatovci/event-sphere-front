<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import SideBar from "@/components/SideBar.vue";

const user = ref({
    firstName: 'Valerie',
    lastName: 'Luna',
    email: 'name@example.com',
    phone: '555-123-4567',
    birthday: '06/10/1988'
});

const activeTab = ref('profile');
const showPasswordChangeForm = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

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

const changeTab = (tab) => {
    activeTab.value = tab;
    if (tab === 'security') {
        showPasswordChangeForm.value = true;
    } else {
        showPasswordChangeForm.value = false;
    }
};

const changePassword = () => {
    if (newPassword.value !== confirmNewPassword.value) {
        alert('New passwords do not match!');
        return;
    }
    // Proceed with password change logic
    console.log('Password changed successfully');
};
</script>

<template>
    <div class="d-flex">
        <side-bar />
        <div class="container-xl px-4 mt-4">
            <nav class="nav nav-borders">
                <a class="nav-link" :class="{ active: activeTab === 'profile' }"
                    @click.prevent="changeTab('profile')">Profile</a>
                <a class="nav-link" :class="{ active: activeTab === 'security' }"
                    @click.prevent="changeTab('security')">Security</a>
            </nav>
            <hr class="mt-0 mb-4">

            <div class="row" v-if="activeTab === 'profile'">
                <div class="col-xl-4">
                    <div class="card mb-4 mb-xl-0">
                        <div class="card-header">Profile Picture</div>
                        <div class="card-body text-center">
                            <img class="img-account-profile rounded-circle mb-2"
                                src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="">
                            <div class="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
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
                                        <input class="form-control" id="inputFirstName" type="text"
                                            placeholder="Enter your first name" v-model="user.firstName">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputLastName">Last name</label>
                                        <input class="form-control" id="inputLastName" type="text"
                                            placeholder="Enter your last name" v-model="user.lastName">
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="small mb-1" for="inputEmailAddress">Email address</label>
                                    <input class="form-control" id="inputEmailAddress" type="email"
                                        placeholder="Enter your email address" v-model="user.email">
                                </div>
                                <div class="row gx-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputPhone">Phone number</label>
                                        <input class="form-control" id="inputPhone" type="tel"
                                            placeholder="Enter your phone number" v-model="user.phone">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputBirthday">Birthday</label>
                                        <input class="form-control" id="inputBirthday" type="text" name="birthday"
                                            placeholder="Enter your birthday" v-model="user.birthday">
                                    </div>
                                </div>
                                <button class="btn btn-primary" type="button" @click="editProfile">Save changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <transition name="slide-fade">
                <div v-if="showPasswordChangeForm" class="card mb-4">
                    <div class="card-header">Change Password</div>
                    <div class="card-body">
                        <form @submit.prevent="changePassword">
                            <div class="mb-3">
                                <label class="small mb-1" for="oldPassword">Old Password</label>
                                <input class="form-control" id="oldPassword" type="password" v-model="oldPassword"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label class="small mb-1" for="newPassword">New Password</label>
                                <input class="form-control" id="newPassword" type="password" v-model="newPassword"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label class="small mb-1" for="confirmNewPassword">Confirm New Password</label>
                                <input class="form-control" id="confirmNewPassword" type="password"
                                    v-model="confirmNewPassword" required>
                            </div>
                            <button class="btn btn-primary" type="submit">Change Password</button>
                        </form>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
    margin-top: 20px;
    background-color: #f2f6fc;
    color: #69707a;
}

.img-account-profile {
    height: 10rem;
}

.rounded-circle {
    border-radius: 50% !important;
}

.card {
    box-shadow: 0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%);
}

.card .card-header {
    font-weight: 500;
}

.card-header:first-child {
    border-radius: 0.35rem 0.35rem 0 0;
}

.card-header {
    padding: 1rem 1.35rem;
    margin-bottom: 0;
    background-color: rgba(33, 40, 50, 0.03);
    border-bottom: 1px solid rgba(33, 40, 50, 0.125);
}

.form-control,
.dataTable-input {
    display: block;
    width: 100%;
    padding: 0.875rem 1.125rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1;
    color: #69707a;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #c5ccd6;
    appearance: none;
    border-radius: 0.35rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
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

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(10px);
}
</style>
