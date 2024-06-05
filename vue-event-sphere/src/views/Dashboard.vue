<template>
  <div class="dashboard" :style="{ backgroundColor: isDarkMode ? '#0f172a' : '#3fa387' }">
    <div class="statistics-box">
      <span class="material-symbols-outlined icon">
        query_stats
      </span>
      <p class="count-text">Daily Statistics</p>
    </div>

    <div class="events-boxes">
      <div class="event-count-box">
        <span class="material-symbols-outlined icon">festival</span>
        <p class="count-text">There are {{ eventCount }} Events</p>
      </div>
      <div class="event-count-box">
        <span class="material-symbols-outlined icon">
          groups
        </span>
        <p class="count-text">There are Users</p>
      </div>
      <div class="event-count-box">
        <span class="material-symbols-outlined icon">
          currency_exchange
        </span>
        <p class="count-text">There are {{ paymentCount }} Payments</p>
      </div>
      <div class="event-count-box">
        <span class="material-symbols-outlined icon">
          assured_workload
        </span>
        <p class="count-text">Secure Transactions </p>
      </div>
      <div class="event-count-box">
        <span class="material-symbols-outlined icon">
          confirmation_number
        </span>
        <p class="count-text">There are {{ ticketCount }} Tickets</p>
      </div>
    </div>

    <div class="dark-mode-button-container">
      <button @click="toggleDarkMode" class="dark-mode-button">
        <span class="material-symbols-outlined">
          dark_mode
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const eventCount = ref(0);
const paymentCount = ref(0);
const ticketCount = ref(0);
const isDarkMode = ref(false); // Reactive variable for dark mode

const fetchEventCount = async () => {
  try {
    const response = await fetch('http://localhost:5220/api/Event/count');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const count = await response.json();
    eventCount.value = count;
  } catch (error) {
    console.error('Error fetching event count:', error);
  }
};

const fetchPaymentCount = async () => {
  try {
    const response = await fetch('http://localhost:5220/api/Payment/count');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const count = await response.json();
    paymentCount.value = count;
  } catch (error) {
    console.error('Error fetching payment count:', error);
  }
};

const fetchTicketCount = async () => {
  try {
    const response = await fetch('http://localhost:5220/api/Ticket/count');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const count = await response.json();
    ticketCount.value = count;
  } catch (error) {
    console.error('Error fetching ticket count:', error);
  }
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

onMounted(() => {
  fetchEventCount();
  fetchPaymentCount();
  fetchTicketCount();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  transition: background-color 0.3s ease;
}

.statistics-box {
  width: 100%;
  padding: 20px;
  background-color: #efefef;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.events-boxes {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
}

.event-count-box {
  width: 230px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.icon {
  font-size: 4rem;
  margin-bottom: 10px;
}

.count-text {
  color: #333;
  font-size: 18px;
  margin: 0;
}

.dark-mode-button-container {
  margin-top: auto;
  /* Pushes the button to the bottom */
}

.dark-mode-button {
  padding: 10px 20px;
  background-color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dark-mode-button:hover {
  background-color: #cccccc;
  color: #ffffff;
}
</style>
