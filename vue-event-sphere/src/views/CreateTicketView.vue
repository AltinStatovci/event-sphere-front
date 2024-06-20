<template>
  <div class="d-flex">
    <side-bar />
    <div class="container-xl px-4 mt-4">
      <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'ticketList' }" @click.prevent="changeTab('ticketList')">Ticket List</a>
        <a class="nav-link" :class="{ active: activeTab === 'ticketForm' }" @click.prevent="changeTab('ticketForm')">Ticket Form</a>
      </nav>
      <hr class="mt-0 mb-4">
      
      <!-- Ticket List Section -->
      <div v-if="activeTab === 'ticketList'">
        <div class="card mb-4">
          <div class="card-header">Ticket List</div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Ticket Type</th>
                  <th scope="col">Price</th>
                  <th scope="col">Booking Reference</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in ticketList" :key="ticket.id">
                  <td>{{ ticket.ticketType }}</td>
                  <td>{{ ticket.price }}</td>
                  <td>{{ ticket.bookingReference }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteTicket(ticket.id)">Delete</button>
                    <button class="btn btn-primary btn-sm" @click="openEditForm(ticket.id)">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Ticket Form Section -->
      <div v-if="activeTab === 'ticketForm'">
        <div class="row">
          <div class="col-xl-12">
            <div class="card mb-4">
              <div class="card-header">Ticket Details</div>
              <div class="card-body">
                <form @submit.prevent="handleSubmit">
                  <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                      <label class="small mb-1" for="ticketType">Ticket Type</label>
                      <input class="form-control" id="ticketType" type="text" placeholder="Enter ticket type" v-model.trim="formData.ticketType">
                    </div>
                    
                  </div>
                  <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                      <label class="small mb-1" for="price">Price</label>
                      <input class="form-control" id="price" type="number" placeholder="Enter price" v-model.trim="formData.price">
                    </div>
                    <div class="col-md-6">
                      <label class="small mb-1" for="bookingReference">Booking Reference</label>
                      <input class="form-control" id="bookingReference" type="text" placeholder="Enter booking reference" v-model.trim="formData.bookingReference">
                    </div>
                  </div>
                  <button class="btn btn-primary" type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Edit Ticket Form Section -->
      <div v-if="showEditForm">
        <UpdateTicketView :ticketId="selectedTicketId" :ticketById="ticketById" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useTicketStore } from "@/store/ticketStore.js";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import SideBar from "@/components/SideBar.vue";
import UpdateTicketView from "./UpdateTicketView.vue";

const ticketStore = useTicketStore();
const router = useRouter();
const ticketById = ref(null);

const formData = reactive({
  eventID: 1,
  ticketType: '',
  price: 0,
  bookingReference: '',
});

const selectedTicketId = ref(null); 

const handleSubmit = async () => {
  try {
    await ticketStore.addTicket(formData);
    Swal.fire({
      title: 'Ticket Added successfully!',
      icon: 'success'
    }).then(() => {
      fetchTickets();
      changeTab('ticketList');
    });
  } catch (e) {
    Swal.fire({
      title: 'Error!',
      text: e.response ? e.response.data : e.message || 'Failed to add ticket',
      icon: 'error'
    });
  }
}

const ticketList = ref([]);

const fetchTickets = async () => {
  ticketList.value = await ticketStore.getTickets();
}

onMounted(fetchTickets);

const deleteTicket = async (ticketId) => {
  try {
    await ticketStore.deleteTicket(ticketId);
    Swal.fire({
      title: "Ticket Deleted successfully!",
      icon: "success"
    }).then(() => {
      fetchTickets();
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.response ? err.response.data : err.message,
      icon: "error"
    });
  }
}

const showEditForm = ref(false);

const openEditForm = (ticketId) => {
  showEditForm.value = true;
  selectedTicketId.value = ticketId;
  ticketById.value = ticketStore.getTicketById(ticketId);
};

const activeTab = ref('ticketList');

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
