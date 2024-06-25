<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  tickets: Object,
});

</script>

<template>
  <div class="card mt-4">
    <div class="card-header">Ticket List</div>
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Ticket Name</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>{{ ticket.ticketName }}</td>
            <td>{{ ticket.price }}</td>
            <td>{{ ticket.quantity }}</td>
            <td>{{ ticket.type }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
</style>
