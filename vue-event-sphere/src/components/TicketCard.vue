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
<template>  <button class="btn btn-primary nav-button left" @click="previousSlide">
      <i class="bi bi-arrow-left-short icon"></i>
    </button>
    <button class="btn btn-primary nav-button right" @click="nextSlide">
      <i class="bi bi-arrow-right-short icon"></i>
    </button>
  <div class="container card my-5">
    <div id="ticket-slideshow" class="ticket-slideshow">
      <div id="ticket-slideshow-container" class="ticket-slideshow-container"
           :style="{ transform: `translateX(-${currentSlide * slideWidth}px)` }">
        <div v-for="(ticket, index) in ticketStore.tickets" :key="index" class="ticket-slideshow-item">
          <div class="card-body">
            <h5 class="card-title">Ticket type: {{ ticket.ticketType }}</h5>
            <p class="card-text">Price: {{ ticket.price }}.00 €</p>
          </div>
          <div class="mt-5">
            <div class="card-body row">
              <div class="d-flex justify-content-between align-items-center">
                <div class="form-group quantity">
                  <label for="quantity">Quantity:</label>
                  <input type="number" class="form-control" v-model="quantity" min="1">
                  <button class="btn btn-primary ml-2" @click="increase">+</button>
                  <button class="btn btn-primary ml-2" @click="decrease">-</button>
                </div>
                <button @click="goToPayment(ticket.id)" class="btn btn-primary">Buy Ticket</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  </div>
</template>


<style scoped>
.ticket-slideshow {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.ticket-slideshow-container {
  display: flex;
  transition: transform 0.5s ease; /* Smooth slide transition */
}

.ticket-slideshow-item {
  flex: 0 0 auto;
  width: 100%;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
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
.nav-button {
  position: absolute;
  top: 37%; /* Adjust the percentage value to move them higher */
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
}
.icon {
  font-size: 23px; /* Adjust the font size as needed */
}
.quantity {
  display: flex;
  align-items: center;
}
.quantity input {
  width: 50px;
  text-align: center;
  margin: 0 5px;
}
</style>
