<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { usePaymentStore } from '@/store/paymentStore'; // Import paymentStore
import { useTicketStore } from '@/store/ticketStore'; // Import ticketStore for fetching tickets

const router = useRouter();
const paymentStore = usePaymentStore(); // Initialize paymentStore
const ticketStore = useTicketStore(); // Initialize ticketStore
const quantity = ref(1);
const currentSlide = ref(0);
const slideWidth = ref(0);
let slidesContainer;

// Fetch tickets on component mount
onMounted(() => {
  ticketStore.getTickets(); // Call method to fetch tickets from ticketStore
   const slidesContainer = document.getElementById('ticket-slideshow');
  slideWidth.value = slidesContainer.clientWidth;
});

 window.addEventListener('resize', () => {
    slideWidth.value = slidesContainer.clientWidth;
  });


watch(quantity, (newQuantity) => {
  paymentStore.amount = newQuantity; // Update quantity in paymentStore
});

const increase = () => { quantity.value++; }
const decrease = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
}
function goToPayment(id) {
  paymentStore.amount = quantity.value;  // Ensure the quantity is updated in the store
  router.push(`/Payment/${id}`);
}

// Slider logic for ticket slideshow


const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % ticketStore.tickets.length;
};

const previousSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + ticketStore.tickets.length) % ticketStore.tickets.length;
};

onMounted(() => {
  setInterval(() => {
    nextSlide();
  }, 14000);
});

defineProps({
  ticket: {
    type: Object,
    required: true
  }
});
</script>
<template>
  <div class="container card-container my-5">
    <div id="ticket-slideshow" class="ticket-slideshow">
      <div id="ticket-slideshow-container" class="ticket-slideshow-container" :style="{ transform: `translateX(-${currentSlide * slideWidth}px)` }">
        <div v-for="(ticket, index) in ticketStore.tickets" :key="index" class="ticket-slideshow-item">
          <div class="card ticket-card">
            <div class="card-header">
              <h5 class="card-title">Ticket type: {{ ticket.ticketType }}</h5>
              <p class="card-text">Price: {{ ticket.price }}.00 €</p>
            </div>
            <div class="card-body">
              <div class="quantity-section">
                <div class="form-group quantity">
                  <label for="quantity">Quantity:</label>
                  <div class="quantity-controls">
                    <input type="number" class="form-control" v-model="quantity" min="1">
                    <button class="btn btn-outline-primary" @click="decrease">-</button>
                    <button class="btn btn-outline-primary" @click="increase">+</button>
                  </div>
                </div>
                <button @click="goToPayment(ticket.id)" class="btn btn-primary">Buy Ticket</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-primary nav-button left" @click="previousSlide">
      <i class="bi bi-arrow-left-short icon"></i>
    </button>
    <button class="btn btn-primary nav-button right" @click="nextSlide">
      <i class="bi bi-arrow-right-short icon"></i>
    </button>
  </div>
</template>

<style scoped>
.ticket-slideshow {
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: transparent; /* Ensure the container background is transparent */
}

.ticket-slideshow-container {
  display: flex;
  transition: transform 0.5s ease;
}

.ticket-slideshow-item {
  flex: 0 0 auto;
  width: 100%;
  padding: 0; /* Remove padding to make the card full width */
}

.ticket-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  width: 100%; /* Ensure the card takes up the full width */
  margin: 0; /* Remove margin */
}

.card-header {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.card-title {
  font-size: 1.5rem;
  margin: 0;
}

.card-text {
  font-size: 1rem;
  margin: 0;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

.quantity-section {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  margin-top: 45px; /* Add margin to create space between header and quantity section */
}

.quantity {
  display: flex;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity input {
  width: 60px;
  text-align: center;
  margin: 0 5px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #007bff;
  background-color: white;
  color: #007bff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-controls button:hover {
  background-color: #007bff;
  color: white;
}

.nav-button {
  position: absolute;
  top: 38%; /* Position both buttons at the same vertical position */
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
  height: 50px; /* Adjust the height as needed */
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button.left {
  left: 10px;
}

.nav-button.right {
  right: 10px;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.icon {
  font-size: 23px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}
</style>
