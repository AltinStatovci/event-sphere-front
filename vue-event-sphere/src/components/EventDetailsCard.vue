<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
});

function goToTicket(id) {
  const redirectUrl = `/Ticket/${id}/event`;
  router.push(redirectUrl);
}
</script>

<template>
  <div v-if="event" class="card d-flex justify-content-center w-25 m-auto mt-5">
    <img :src="`data:image/png;base64,${event.photoData}`" class="card-img-top" alt="Event Image">
    <div class="card-body">
      <h5 class="card-title">Event name: {{ event.eventName }}</h5>
      <p class="card-text">Event description: {{ event.description }}</p>
      <p class="card-text">Event location: {{ event.location }}</p>
      <p class="card-text">Event start date: {{ event.startDate }}</p>
      <p class="card-text">Event end date: {{ event.endDate }}</p>
      <p class="card-text">Event organizer: {{ event.organizer }}</p>
      <p class="card-text">Event max attendance: {{ event.maxAttendance }}</p>
      <p class="card-text">Event available tickets: {{ event.availableTickets }}</p>
      <button @click="() => goToTicket(event.id)" class="btn btn-primary">Buy Ticket</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 25%;
  margin: auto;
  margin-top: 5rem;
}

.card-img-top {
  height: 25%;
  margin: auto;
}
</style>
