<script setup>
import {computed, reactive, ref} from "vue";
import{useAuthStore} from "@/store/authStore.js";
import {useRoute, useRouter} from "vue-router";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const formData = reactive({
 name:'',
  lastName:'',
  email: '',
  password: '',
  roleId: 3,
})

const formIsValid = ref(true);
const error = ref('');

const router = useRouter();
const route = useRoute();

async function handleSubmit(){
    formIsValid.value = true;

  if(!formData.email || !formData.password || !formData.name || !formData.lastName) {

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
      await authStore.signUp(formData)

      await Swal.fire({
        title: "Signed up successfully!",
        text: "Please login!",
        icon: "success"
      });
    const redirectUrl = `${route.query.redirect || "login"}`

    await router.push({name: redirectUrl});

  } catch (e) {
    formIsValid.value = false;
    // error.value = e.response.data.error.message;
    console.log(e)
  }

}

</script>

<template>
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex align-items-center justify-content-center h-100">
        <div class="col-md-8 col-lg-7 col-xl-6">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
               class="img-fluid" alt="Phone image">
        </div>
        <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">

          <form @submit.prevent="handleSubmit">
            <!-- Name input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form1Example13"> Name</label>
              <input
                  type="text"
                  id="form1Example13"
                  class="form-control form-control-lg"
                  placeholder="Enter Name"
                  v-model.trim="formData.name"
              />

            </div>

            <!-- Surname input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form1Example13">Surname</label>
              <input
                  type="text"
                  id="form1Example13"
                  class="form-control form-control-lg"
                  placeholder="Enter Surname"
                  v-model.trim="formData.lastName"
              />

            </div>




            <!-- Email input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form1Example13">Email address</label>
              <input
                  type="email"
                  id="form1Example13"
                  class="form-control form-control-lg"
                  placeholder="Enter email"
                  v-model.trim="formData.email"
              />

            </div>

            <!-- Password input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form1Example23">Password</label>
              <input
                  type="password"
                  id="form1Example23"
                  class="form-control form-control-lg"
                  placeholder="Enter password"
                  v-model.trim="formData.password"
              />

            </div>


          <div class="d-flex justify-content-around align-items-center mb-4">
            <button type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-lg btn-block d-flex justify-content-center">Sign Up</button>

            <p class="text-md-center fw-bold mx-3 mb-0 text-muted">Or</p>

            <a data-mdb-ripple-init class="btn btn-outline-primary btn-medium btn-block m-2 " href="/login"
               role="button" >
              <i >Log in</i >
            </a>

          </div>
            <!-- Submit button -->

          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#form1Example13, #form1Example23{
  width: 520px;
  border: 1px solid rgb(209, 207, 207);
}
</style>