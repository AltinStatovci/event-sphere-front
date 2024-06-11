<template>
  <div class="d-flex">
    <side-bar />
    <div class="container-xl px-4 mt-4">
      <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'eventList' }" @click.prevent="changeTab('eventList')">Event
          List</a>
        <a class="nav-link" :class="{ active: activeTab === 'eventForm' }" @click.prevent="changeTab('eventForm')">Event
          Form</a>
      </nav>
      <hr class="mt-0 mb-4">

      <div v-if="activeTab === 'eventList'">
        <div class="card mb-4">
          <div class="card-header">Event List</div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Event Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Location</th>
                  <th scope="col">Category ID</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Max Attendees</th>
                  <th scope="col">Available Tickets</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in eventList" :key="event.id">
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.description }}</td>
                  <td>{{ event.location }}</td>
                  <td>{{ event.categoryId }}</td>
                  <td>{{ event.startDate }}</td>
                  <td>{{ event.endDate }}</td>
                  <td>{{ event.maxAttendees }}</td>
                  <td>{{ event.availableTickets }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteEvent(event.id)">Delete</button>
                    <button class="btn btn-primary btn-sm" @click="openEditForm(event.id)">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Event Form Section -->
      <div v-if="activeTab === 'eventForm'">
        <div class="row">
          <div class="col-xl-12">
            <div class="card mb-4">
              <div class="card-header">Event Details</div>
              <div class="card-body">
                <form @submit.prevent="handleSubmit">
                  <!-- Event Details Form -->
                  <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                      <label class="small mb-1" for="eventName">Event Name</label>
                      <input class="form-control" id="eventName" type="text" placeholder="Enter event name"
                        v-model.trim="formData.eventName">
                    </div>
                    <div class="col-md-6">
                      <label class="small mb-1" for="description">Description</label>
                      <input class="form-control" id="description" type="text" placeholder="Enter description"
                        v-model.trim="formData.description">
                    </div>
                  </div>

                  <!-- Additional Event Details -->
                  <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                      <label class="small mb-1" for="location">Location</label>
                      <input class="form-control" id="location" type="text" placeholder="Enter location"
                        v-model.trim="formData.location">
                    </div>
                    <div class="col-md-6">
                      <label class="small mb-1" for="categoryId">Category ID</label>
                      <input class="form-control" id="categoryId" type="number" v-model="formData.categoryId">
                    </div>
                  </div>

                  <!-- Date and Attendees Details -->
                  <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                      <label class="small mb-1" for="startDate">Start Date</label>
                      <input class="form-control" id="startDate" type="datetime-local" v-model="formData.startDate">
                    </div>
                    <div class="col-md-6">
                      <label class="small mb-1" for="endDate">End Date</label>
                      <input class="form-control" id="endDate" type="datetime-local" v-model="formData.endDate">
                    </div>
                  </div>

                  <!-- Max Attendees and Tickets -->
                  <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                      <label class="small mb-1" for="maxAttendees">Max Attendees</label>
                      <input class="form-control" id="maxAttendees" type="number" v-model="formData.maxAttendees">
                    </div>
                    <div class="col-md-6">
                      <label class="small mb-1" for="availableTickets">Available Tickets</label>
                      <input class="form-control" id="availableTickets" type="number"
                        v-model="formData.availableTickets">
                    </div>
                  </div>

                  <!-- Profile Picture Upload Section -->
                  <div class="row gx-3 mb-3">
                    <div class="col-md-12">
                      <div class="card mb-4 mb-xl-0">
                        <div class="card-header">Event Image</div>
                        <div class="card-body text-center">
                          <div class="image-container" :style="{ backgroundImage: `url(${imageUrl})` }">
                            <div v-if="!imageUrl" class="placeholder">No Image Selected</div>
                          </div>
                          <div class="small font-italic text-muted mb-4">Upload your Event Image</div>
                          <input class="form-control" id="file" type="file" ref="fileInput" @change="handleImageUpload"
                            style="display: none;">
                          <button class="btn btn-primary" type="button" @click="$refs.fileInput.click()">Upload new
                            image</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button class="btn btn-primary" type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Event Form Section -->
      <div v-if="showEditForm">
        <UpdateEventView :eventId="selectedEventId" :eventById="eventById" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useEventStore } from "@/store/eventStore.js";
import { useAuthStore } from "@/store/authStore.js";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import SideBar from "@/components/SideBar.vue";
import UpdateEventView from "@/views/UpdateEventView.vue";

const eventStore = useEventStore();
const router = useRouter();
const authStore = useAuthStore();
const eventById = ref(null);

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

const imageUrl = ref('https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg');

const selectedEventId = ref(null);

const handleSubmit = async () => {
  try {
    await eventStore.addEvent(formData);
    Swal.fire({
      title: "Event Added successfully!",
      icon: "success"
    }).then(() => {
      const redirectUrl = `/`;
      router.push(redirectUrl);
    });
  } catch (e) {
    await Swal.fire({
      title: "Error!",
      text: e.message,
      icon: "error"
    });
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.image = file;
    imageUrl.value = URL.createObjectURL(file);
  }
};

// Fetch event data dynamically
const eventList = ref([]);

const fetchEvents = async () => {
  eventList.value = await eventStore.getEvents();
}

// Call fetchEvents when component is mounted
onMounted(fetchEvents);

const deleteEvent = async (eventId) => {
  try {
    await eventStore.deleteEvent(eventId);
    Swal.fire({
      title: "Event Deleted successfully!",
      icon: "success"
    }).then(() => {
      location.reload();
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.value,
      icon: "error"
    });
  }
}

const showEditForm = ref(false);


const openEditForm = (eventId) => {
  // selectedEvent.value = event;
  showEditForm.value = true;
  selectedEventId.value = eventId;
  eventById.value = eventStore.getEventById(eventId);
  // console.log(eventById.value);
};

const activeTab = ref('eventList');

const changeTab = (tab) => {
  activeTab.value = tab;
};
</script>

<style scoped>
/* Your scoped styles here */
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

.image-container {
  width: 10rem;
  height: 10rem;
  border: 1px solid #c5ccd6;
  border-radius: 0.35rem;
  /* changed from 50% to 0.35rem for square shape */
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.placeholder {
  color: #69707a;
  font-size: 0.875rem;
  text-align: center;
}
</style>
