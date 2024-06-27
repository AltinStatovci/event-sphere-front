<script setup>
import { defineProps, onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useLocationStore } from '@/store/locationStore';

const locationStore = useLocationStore();
const location = ref({ city: '', country:'' });
const router = useRouter();

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
});

function goToTicket(id) {
  const redirectUrl = `/Ticket/${id}/event`;
  router.push(redirectUrl);
}
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
function formatTimeAndDate(timestamp) {
    var dt = new Date(timestamp);

    var month = dt.toLocaleString('default', { month: 'long' });
    var day = dt.getDate();
    var year = dt.getFullYear();
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var seconds = dt.getSeconds();

    var am_pm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var formattedTimeAndDate = month + ' ' + day + ', ' + year + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + am_pm;

    return formattedTimeAndDate;
}

// Example usage:
var timestamp = "2024-06-19T12:21:55.623";
var formatted = formatTimeAndDate(timestamp);
console.log(formatted);


</script>

<template>
  <div v-if="event" class="card d-flex justify-content-center w-25 m-auto mt-5">
    <img :src="`data:image/png;base64,${event.photoData}`" class="card-img-top" alt="Event Image">
    <div class="card-body">
      <h5 class="card-title">{{ event.eventName }}</h5>
      <p class="card-text">{{ event.description }}</p>
      <p class="card-text"><i class="bi bi-geo-alt-fill mr-3"></i>{{ event.address }}, {{ location.city }}, {{ location.country }}</p>
      <p class="card-text"><i class="bi bi-calendar-event mr-3"></i> {{ formatTimeAndDate(event.startDate) }}</p>
      <p class="card-text"><i class="bi bi-calendar-event-fill"></i> {{ formatTimeAndDate(event.endDate) }}</p>
      <p class="card-text"><i class="bi bi-person-fill"></i> {{ event.organizerName }}</p>
      <p class="card-text"><i class="bi bi-people"></i>Max attendance: {{ event.maxAttendance }}</p>
      <p class="card-text"><i class="bi bi-ticket-detailed"></i> Available tickets: {{ event.availableTickets }}</p>
      <button @click="() => goToTicket(event.id)" class="btn">Buy Ticket</button>
    </div>
  </div>
  <div v-else>
    Loading event details...
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
i{
  margin-right: 10px;
  color: #6596E0;
}
.btn {
  text-transform: none;
  background-color: transparent;
  color: #6596E0;
}
</style>