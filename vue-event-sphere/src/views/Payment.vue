<template>
  <div class="d-flex">
    <SideBar />
    <div class="container-xl px-4 mt-4">
      <nav class="nav nav-borders">
        <a class="nav-link">Payment List</a>
      </nav>
      <hr class="mt-0 mb-4">

      <div v-if="authStore.isOrganizer" class="dropdown-container">
        <label for="event-select">Select an Event:</label>
        <select id="event-select" v-model="selectedEvent" @change="fetchPayments" class="form-select">
          <option value="" disabled>Select an event</option>
          <option v-for="event in eventStore.events" :key="event.id" :value="event.id">
            {{ event.eventName }}
          </option>
        </select>
      </div>

      <div>
        <div class="card mb-4">
          <div class="card-header">Payment List</div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Name</th>
                  <th>Ticket ID</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in payments" :key="payment.id">
                  <td>{{ payment.id }}</td>
                  <td>{{ payment.userName || 'N/A' }}</td>
                  <td>{{ payment.ticketName || 'N/A' }}</td>
                  <td>{{ payment.amount }}</td>
                  <td>{{ payment.paymentMethod }}</td>
                  <td>{{ payment.paymentStatus }}</td>
                  <td>{{ formatPaymentDateTime(payment.paymentDate) }}</td>
                </tr>
                <tr v-if="payments.length === 0">
                  <td colspan="7" class="no-data">No payments available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SideBar from "@/components/SideBar.vue";
import { useAuthStore } from "@/store/authStore.js";
import { usePaymentStore } from "@/store/paymentStore.js";
import { useEventStore } from "@/store/eventStore.js";

const payments = ref([]);
const paymentStore = usePaymentStore();
const authStore = useAuthStore();
const eventStore = useEventStore();
const selectedEvent = ref(null);

const fetchPayments = async () => {
  if (selectedEvent.value) {
    await paymentStore.getPaymentsByEvent(selectedEvent.value);
    payments.value = paymentStore.payments;
  } else {
    payments.value = []; // Clear payments if no event is selected
  }
};

const fetchUserPayments = async () => {
  await paymentStore.getPaymentsByUserId(authStore.id);
  payments.value = paymentStore.payments;
};

const formatPaymentDateTime = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
  return `${formattedDate} - ${formattedTime}`;
};

onMounted(async () => {
  if (authStore.isOrganizer) {
    await eventStore.getEventByOrganizer(authStore.id);
  } else {
    await fetchUserPayments();
  }
});
</script>

<style scoped>
.dashboard {
    display: flex;
    height: 100vh;
    width: 100%;
}

.content {
    flex: 1;
    padding: 20px;
    margin-left: 20px;
    margin-top: 40px;
    margin-right: 40px;
    margin-bottom: 150px;
    background-color: rgba(33, 40, 50, 0.03);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
}

.table-container {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.no-data {
    text-align: center;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    color: #999;
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
.dataTable-input,
.form-select {
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

nav.nav-borders .nav-link {
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

.dropdown-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.dropdown-container label {
  margin-bottom: 8px;
  font-weight: bold;
}

.dropdown-container .form-select {
  padding: 0.75rem 1rem;
  border-radius: 0.35rem;
  border: 1px solid #c5ccd6;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.dropdown-container .form-select:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
