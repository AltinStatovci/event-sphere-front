<script setup>

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

          <form>
            <!-- Name input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form1Example13"> Name</label>
              <input type="email" id="form1Example13" class="form-control form-control-lg" />

            </div>

            <!-- Surname input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form1Example13">Surname</label>
              <input type="email" id="form1Example13" class="form-control form-control-lg" />

            </div>




            <!-- Email input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form1Example13">Email address</label>
              <input type="email" id="form1Example13" class="form-control form-control-lg" />

            </div>

            <!-- Password input -->
            <div data-mdb-input-init class="form-outline mb-4">
              <label class="form-label" for="form1Example23">Password</label>
              <input type="password" id="form1Example23" class="form-control form-control-lg" />

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

</style>