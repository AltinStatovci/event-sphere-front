
<script setup>
import { ref } from 'vue';

// Initialize quantity as a ref with value 1
const quantity = ref(1);

// Define functions to increase and decrease quantity
const increase = () => { quantity.value++; }
const decrease = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

// Define props
defineProps({
  ticket: {
    type: Object,
    required: true
  }
});
</script>

<template>
    <div class="container card my-5">
      <div class="card-body">
        <h5 class="card-title">Ticket type: {{ ticket.ticketType }}</h5>
        <p class="card-text">Price: {{ ticket.price }}</p>
        <p class="card-text">Date:</p>
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
            <a href="#" class="btn btn-primary">Buy Ticket</a>
          </div>
        </div>
      </div>
    </div>
  </template>

  
  <style scoped>
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
  