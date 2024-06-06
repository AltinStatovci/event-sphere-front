<script setup>
import { computed, reactive, ref } from "vue";
import {useEventStore} from "@/store/eventStore.js";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const eventStore = useEventStore()
const router = useRouter();
const route = useRoute();

const formData = reactive({
  eventName: '',
  description: '',
  startDate: '',
  endDate: '',
  categoryId: 0,
  organizerId: 0,
  photoData: '',
  MaxAttendees: 0,
  AvailableTickets: false,
  createAt:''
});


async function  handleSubmit() {
  try {
    await eventStore.addEvent(formData);
    const redirectUrl = `/`;
    await router.push(redirectUrl);
  } catch (e) {
    await Swal.fire({
      title: "Error!",
      text: e.message,
      icon: "error"
    });
  }
}

</script>

<template >
  <div class="container mt-5">
  <form @submit.prevent="handleSubmit">
    <!-- Email input -->
    <div data-mdb-input-init class="form-outline mb-4">
      <label class="form-label" for="form1Example13"> Event Name</label>
      <input type="text" id="form1Example13" class="form-control form-control-lg"
             placeholder="Enter event" v-model.trim="formData.eventName" />

    </div>

    <div data-mdb-input-init class="form-outline mb-4">
      <label class="form-label" for="form1Example13"> Event Name</label>
      <input type="text" id="form1Example13" class="form-control form-control-lg"
             placeholder="Enter event" v-model.trim="formData.eventName" />

    </div>

    <div data-mdb-input-init class="form-outline mb-4">
      <label class="form-label" for="form1Example13"> Event Name</label>
      <input type="text" id="form1Example13" class="form-control form-control-lg"
             placeholder="Enter event" v-model.trim="formData.eventName" />

    </div>

    <div data-mdb-input-init class="form-outline mb-4">
      <label class="form-label" for="form1Example13"> Event Name</label>
      <input type="text" id="form1Example13" class="form-control form-control-lg"
             placeholder="Enter event" v-model.trim="formData.eventName" />

    </div>

    <div data-mdb-input-init class="form-outline mb-4">
      <label class="form-label" for="form1Example13"> Event Name</label>
      <input type="text" id="form1Example13" class="form-control form-control-lg"
             placeholder="Enter event" v-model.trim="formData.eventName" />

    </div>

    <div data-mdb-input-init class="form-outline mb-4">
      <label class="form-label" for="form1Example13"> Event Name</label>
      <input type="text" id="form1Example13" class="form-control form-control-lg"
             placeholder="Enter event" v-model.trim="formData.eventName" />

    </div>

    <div data-mdb-input-init class="form-outline mb-4">
      <label class="form-label" for="form1Example13"> Event Name</label>
      <input type="text" id="form1Example13" class="form-control form-control-lg"
             placeholder="Enter event" v-model.trim="formData.eventName" />

    </div>

    <div data-mdb-input-init class="form-outline mb-4">
      <label class="form-label" for="form1Example13"> Event Name</label>
      <input type="text" id="form1Example13" class="form-control form-control-lg"
             placeholder="Enter event" v-model.trim="formData.eventName" />

    </div>

    <button type="submit" data-mdb-button-init data-mdb-ripple-init
            class="btn btn-primary btn-lg btn-block d-flex justify-content-center">Submit</button>


  </form>
  </div>
</template>

<style scoped>

</style>