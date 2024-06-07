<script setup>
import { computed, reactive, ref } from "vue";
import { useEventStore } from "@/store/eventStore.js";
import { useAuthStore } from "@/store/authStore.js";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const eventStore = useEventStore();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formData = reactive({
  eventName: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  categoryId: 0,
  organizerId: authStore.id,
  maxAttendees: 0,
  availableTickets: 0,
  dateCreated: new Date().toISOString(),
  image: '',
});

const handleSubmit = async () => {
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

const handleImageUpload = (event) => {
  formData.image = event.target.files[0];
};


</script>

<template>
  <div class="container mt-5">
    <form @submit.prevent="handleSubmit">
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="eventName">Event Name</label>
        <input type="text" id="eventName" class="form-control form-control-lg" placeholder="Enter event name"
          v-model.trim="formData.eventName" />
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="description">Description</label>
        <input type="text" id="description" class="form-control form-control-lg" placeholder="Enter description"
          v-model.trim="formData.description" />
      </div>
      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="description">Location</label>
        <input type="text" id="description" class="form-control form-control-lg" placeholder="Enter description"
          v-model.trim="formData.location" />
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="startDate">Start Date</label>
        <input type="datetime-local" id="startDate" class="form-control form-control-lg" v-model="formData.startDate" />
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="endDate">End Date</label>
        <input type="datetime-local" id="endDate" class="form-control form-control-lg" v-model="formData.endDate" />
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="categoryId">Category ID</label>
        <input type="number" id="categoryId" class="form-control form-control-lg" v-model="formData.categoryId" />
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="maxAttendees">Max Attendees</label>
        <input type="number" id="maxAttendees" class="form-control form-control-lg" v-model="formData.maxAttendees" />
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="availableTickets">Available Tickets</label>
        <input type="number" id="availableTickets" v-model="formData.availableTickets" />
      </div>
      <!-- <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="startDate">Date Created:</label>
        <input type="datetime-local" id="startDate" class="form-control form-control-lg" v-model="formData.dateCreated" />
      </div> -->

      <div data-mdb-input-init class="form-outline mb-4">
        <label class="form-label" for="file">Choose File</label>
        <input type="file" id="file" class="form-control form-control-lg" @change="handleImageUpload" />
      </div>

      <button type="submit" data-mdb-button-init data-mdb-ripple-init
        class="btn btn-primary btn-lg btn-block d-flex justify-content-center">Submit</button>
    </form>
  </div>
</template>

<style scoped>
/* Add any scoped styles here */
</style>
