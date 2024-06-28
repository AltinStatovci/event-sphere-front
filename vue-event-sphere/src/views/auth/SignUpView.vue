<script setup>
import { computed, reactive, ref } from "vue";
import { useAuthStore } from "@/store/authStore.js";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const formData = reactive({
  name: '',
  lastName: '',
  email: '',
  password: '',
  roleId: 3,
});

const formIsValid = ref(true);
const error = ref('');

const router = useRouter();
const route = useRoute();

async function handleSubmit() {
  formIsValid.value = true;

  if (!formData.email || !formData.password || !formData.name || !formData.lastName) {
    formIsValid.value = false;
    error.value = 'All Fields are required.'

    await Swal.fire({
      title: "Error!",
      text: error.value,
      icon: "error"
    });

    return;
  }

  try {
    await authStore.signUp(formData);

    await Swal.fire({
      title: "Signed up successfully!",
      text: "Please login!",
      icon: "success"
    });

    const redirectUrl = `${route.query.redirect || "login"}`;
    await router.push({ name: redirectUrl });

  } catch (e) {
    formIsValid.value = false;
    let errorMessage = 'This email already exists!. Please log in.';

    await Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error"
    });
  }
}
</script>

<template>
  <section class="vh-100 d-flex">
    <div class="video-section">
      <video playsinline autoplay muted loop src="/EventVideo.mp4"></video>
    </div>
    <div class="form-section d-flex align-items-center justify-content-center">
      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="form-header">
          <span class="material-symbols-outlined">account_circle</span>
          <h2>Sign Up</h2>
        </div>
        <!-- Name input -->
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="form1Example13">Name</label>
          <input type="text" id="form1Example13" class="form-control form-control-lg" placeholder="Enter Name"
            v-model.trim="formData.name" />
        </div>
        <!-- Surname input -->
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="form1Example14">Surname</label>
          <input type="text" id="form1Example14" class="form-control form-control-lg" placeholder="Enter Surname"
            v-model.trim="formData.lastName" />
        </div>
        <!-- Email input -->
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="form1Example15">Email address</label>
          <input type="email" id="form1Example15" class="form-control form-control-lg" placeholder="Enter email"
            v-model.trim="formData.email" />
        </div>
        <!-- Password input -->
        <div data-mdb-input-init class="form-outline mb-4">
          <label class="form-label" for="form1Example16">Password</label>
          <input type="password" id="form1Example16" class="form-control form-control-lg" placeholder="Enter password"
            v-model.trim="formData.password" />
        </div>
        <!-- Submit button -->
        <div class="d-flex justify-content-around align-items-center mb-4">
          <button type="submit" data-mdb-button-init data-mdb-ripple-init
            class="btn btn-primary btn-lg btn-block d-flex justify-content-center">Sign Up</button>
          <a data-mdb-ripple-init class="btn btn-outline-primary btn-medium btn-block m-2" href="/login" role="button">
            <i>Log in</i>
          </a>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.vh-100 {
  height: 100vh;
  display: flex;
}

.video-section {
  width: 70%;
  position: relative;
  overflow: hidden;
}

.video-section video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-section {
  width: 30%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 520px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-header {
  text-align: center;
  margin-bottom: 20px;
}

.form-header .material-symbols-outlined {
  font-size: 48px;
  display: block;
  margin: 0 auto;
}

.form-header h2 {
  font-size: 24px;
  margin-top: 10px;
}

.form-outline {
  width: 100%;
}

#form1Example13,
#form1Example14,
#form1Example15,
#form1Example16 {
  width: 100%;
  max-width: 520px;
  border: 1px solid rgb(209, 207, 207);
}
</style>
