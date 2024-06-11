<script setup>
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';

const router = useRouter();

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
});


function goToEvent(eventId) {
  const redirectUrl = `/eventdetails/${eventId}`;
  router.push(redirectUrl);
}
</script>

<template>
  <div>
    <div class="d-flex my-5">
      <div class="card mx-5" style="width: 23rem;">
        <img :src="`data:image/png;base64,${event.photoData}`" class="card-img-top" alt="Base64 Image">
        <div class="card-body">
          <h5 class="card-title">{{ event.eventName }}</h5>
          <p class="card-text">{{ event.description }}</p>
          <p class="card-text">{{ event.location }}</p>
          <p class="card-text">{{ event.startDate }}</p>
          <p class="card-text">{{ event.endDate }}</p>
          <button @click="() => goToEvent(event.id)" class="btn btn-primary">Go to event</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
