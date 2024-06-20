<script setup>
import { useRouter } from 'vue-router';
import { defineProps, onMounted, ref } from 'vue';
import { useLocationStore } from '@/store/locationStore';

const locationStore = useLocationStore();

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

const location = ref({ city: '', country:'' });

const getLocation = async () => {
  try {
    const loc = await locationStore.getLocationById(props.event.locationId);
    location.value = loc;
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  await getLocation();
})

function formatDateString(dateString) {
  const monthsFull = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthsFull[monthIndex]} ${year}`;
}
</script>

<template>
  <div>
    <div class="d-flex my-5">
      <div class="card mx-3" style="width: 23rem">
        <img :src="`data:image/png;base64,${event.photoData}`" class="card-img-top" alt="Base64 Image" width="100%" height="250px">
        <div class="card-body">
          <h5 class="card-title text-center mb-4 event-title">{{ event.eventName }}</h5>
          <p class="card-text">{{ event.description }}</p>
          <div class="d-flex">
            <p class="card-text"><i class="bi bi-calendar-event mr-3"></i>{{ formatDateString(event.startDate) }}</p>
            <span class="mx-2">-</span>
            <p class="card-text">{{ formatDateString(event.endDate) }}</p>
          </div>
          <p class="card-text address" v-if="location.city"><i class="bi bi-geo-alt-fill mr-3"></i>{{ location.city }}, {{ location.country }}</p>
          <button @click="() => goToEvent(event.id)" class="btn">Find out more</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-title {
  font-size: 1.5rem;
  color: #333;
  text-transform: capitalize;
}
.mr-3 {
  margin-right: 1rem;
}
.btn {
  text-transform: none;
  background-color: transparent;
  color: #6596E0;
  outline: #6596E0;
}
i {
  color: #6596E0;
}
.address{
  text-transform: capitalize;
}
</style>
