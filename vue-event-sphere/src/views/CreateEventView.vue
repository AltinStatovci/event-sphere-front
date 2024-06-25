<script setup>
import { ref, reactive, onMounted } from "vue";
import { useEventStore } from "@/store/eventStore.js";
import { useAuthStore } from "@/store/authStore.js";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import SideBar from "@/components/SideBar.vue";
import TicketList from "@/components/TicketList.vue";
import { useLocationStore } from '@/store/locationStore';
import { useCategoryStore } from "@/store/categoryStore";
import { useTicketStore } from "@/store/ticketStore";

const router = useRouter();
const eventStore = useEventStore();
const authStore = useAuthStore();
const eventById = ref(null);
const locationStore = useLocationStore();
const categoryStore = useCategoryStore();
const ticketStore = useTicketStore();
const locations = ref([]);
const categories = ref([]);
const ticketList = ref([]);
const showTicketsForEventId = ref(null);

const formData = reactive({
  id: '',
  eventName: '',
  description: '',
  startDate: '',
  endDate: '',
  address: '',
  locationId: '',
  categoryID: '',
  organizerID: authStore.id,
  maxAttendance: 0,
  availableTickets: 0,
  dateCreated: new Date().toISOString(),
  image: '',
});

const imageUrl = ref('https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg');

const selectedEventId = ref(null);
const isEditMode = ref(false);

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      await eventStore.updateEvent(formData);
      Swal.fire({
        title: "Event Updated successfully!",
        icon: "success"
      }).then(() => {
        const redirectUrl = `/`;
        router.push(redirectUrl);
      });
    } else {
      await eventStore.addEvent(formData);
      Swal.fire({
        title: "Event Added successfully!",
        icon: "success"
      }).then(() => {
        const redirectUrl = `/`;
        router.push(redirectUrl);
      });
    }
  } catch (e) {
    await Swal.fire({
      title: "Error!",
      text: e.message,
      icon: "error"
    });
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.image = file;
    imageUrl.value = URL.createObjectURL(file);
  }
};

const eventList = ref([]);

const fetchEvents = async () => {
  eventList.value = await eventStore.getEventByOrganizer(authStore.id);
}

const getAllLocations = async () => {
  try {
    const response = await locationStore.getLocations();
    locations.value = response;
  } catch (err) {
    console.error(err);
  }
};

const getAllCategories = async () => {
  try {
    const response = await categoryStore.getAllCategories();
    categories.value = response;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchEvents();
  getAllLocations();
  getAllCategories();
})

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

const openEditForm = async (eventId) => {
  selectedEventId.value = eventId; 
  isEditMode.value = true;
  showEditForm.value = true;
  eventById.value = await eventStore.getEventById(eventId);

  formData.id = eventById.value.id;
  formData.eventName = eventById.value.eventName;
  formData.description = eventById.value.description;
  formData.startDate = eventById.value.startDate;
  formData.endDate = eventById.value.endDate;
  formData.address = eventById.value.address;
  formData.locationId = eventById.value.locationId;
  formData.categoryID = eventById.value.categoryID;
  formData.maxAttendance = eventById.value.maxAttendance;
  formData.availableTickets = eventById.value.availableTickets;
  formData.image = eventById.value.image;
  changeTab('eventForm');
};

const activeTab = ref('eventList');

const changeTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'eventForm' && !isEditMode.value) {
    resetForm();
  }
};

const resetForm = () => {
  formData.eventName = '';
  formData.description = '';
  formData.startDate = '';
  formData.endDate = '';
  formData.address = '';
  formData.locationId = '';
  formData.categoryID = '';
  formData.maxAttendance = 0;
  formData.availableTickets = 0;
  formData.image = '';
  imageUrl.value = 'https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg';
  isEditMode.value = false;
  selectedEventId.value = null;
};

const getTickets = async (id) => {
  showTicketsForEventId.value = id;
  const response = await ticketStore.getTicketByEvent(id);
  ticketList.value = response.value;
}

</script>

<template>
  <div class="d-flex">
    <side-bar />
    <div class="container-xl px-4 mt-4">
      <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'eventList' }" @click.prevent="changeTab('eventList')">Event List</a>
        <a class="nav-link" :class="{ active: activeTab === 'eventForm' }" @click.prevent="changeTab('eventForm')">Event Form</a>
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
                  <th scope="col">Location</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Max Attendees</th>
                  <th scope="col">Available Tickets</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in eventList" :key="event.id">
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.address }}</td>
                  <td>{{ event.categoryName }}</td>
                  <td>{{ event.startDate }}</td>
                  <td>{{ event.endDate }}</td>
                  <td>{{ event.maxAttendance }}</td>
                  <td>{{ event.availableTickets }}</td>
                  <td>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteEvent(event.id)">Delete</button>
                    <button class="btn btn-outline-primary btn-sm" @click="openEditForm(event.id)">Edit</button>
                    <button class="btn btn-outline-secondary btn-sm" @click="getTickets(event.id)">See Tickets</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ticket-list v-if="showTicketsForEventId" :tickets="ticketList" />
      </div>

      <!-- Event Form Section -->
      <div v-if="activeTab === 'eventForm'">
        <div class="row">
          <div class="col-xl-12">
            <div class="card mb-4">
              <div class="card-header">{{ isEditMode ? 'Edit Event' : 'Create Event' }}</div>
              <div class="card-body">
                <form @submit.prevent="handleSubmit">
                  <!-- Event Details Form -->
                  <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                      <label class="small mb-1" for="eventName">Event Name</label>
                      <input class="form-control" id="eventName" type="text" placeholder="Enter event name" v-model.trim="formData.eventName">
                    </div>

                    <div class="col-md-3">
                      <label class="small mb-1" for="categorySelect">Category</label>
                      <select id="categorySelect" class="form-control custom-select" v-model.trim="formData.categoryID">
                        <option value="" disabled>Select a Category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>

                    <div class="col-md-3">
                      <label class="small mb-1" for="locationSelect">Location</label>
                      <select id="locationSelect" class="form-control custom-select" v-model.trim="formData.locationId">
                        <option value="" disabled>Select a Location</option>
                        <option v-for="location in locations" :key="location.id" :value="location.id">
                          {{ location.locationName }}
                        </option>
                      </select>
                    </div>

                    <div class="col-md-3">
                      <label class="small mb-1" for="address">Address</label>
                      <input class="form-control" id="address" type="text" placeholder="Enter address" v-model.trim="formData.address">
                    </div>
                  </div>

                  <div class="row gx-3 mb-3">
                    <div class="col-md-3">
                      <label class="small mb-1" for="startDate">Start Date</label>
                      <input class="form-control" id="startDate" type="date" v-model.trim="formData.startDate">
                    </div>

                    <div class="col-md-3">
                      <label class="small mb-1" for="endDate">End Date</label>
                      <input class="form-control" id="endDate" type="date" v-model.trim="formData.endDate">
                    </div>

                    <div class="col-md-3">
                      <label class="small mb-1" for="maxAttendance">Max Attendance</label>
                      <input class="form-control" id="maxAttendance" type="number" v-model.trim="formData.maxAttendance">
                    </div>

                    <div class="col-md-3">
                      <label class="small mb-1" for="availableTickets">Available Tickets</label>
                      <input class="form-control" id="availableTickets" type="number" v-model.trim="formData.availableTickets">
                    </div>
                  </div>

                  <div class="row gx-3 mb-3">
                    <div class="col-md-3">
                      <label class="small mb-1" for="description">Description</label>
                      <textarea class="form-control" id="description" v-model.trim="formData.description"></textarea>
                    </div>

                    <div class="col-md-3">
                      <label class="small mb-1" for="image">Event Image</label>
                      <input class="form-control" id="image" type="file" @change="handleImageUpload">
                    </div>

                    <div class="col-md-3">
                      <img :src="imageUrl" alt="Event Image" class="img-fluid" style="max-width: 100px;">
                    </div>
                  </div>

                  <button class="btn btn-primary" type="submit">{{ isEditMode ? 'Update' : 'Add' }} Event</button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- End of Event Form Section -->
    </div>
  </div>
</template>

<style scoped>
</style>
