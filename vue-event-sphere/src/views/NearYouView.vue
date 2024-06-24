<script setup>
import { useEventStore } from '@/store/eventStore';
import { useLocationStore } from '@/store/locationStore';
import { onMounted, ref, watch, computed } from 'vue';
import EventCard from '@/components/EventCard.vue';


const locationStore = useLocationStore();
const locations = ref([]);
const filterBy = ref('');
const selectedCity = ref('');
const selectedCountry = ref('');
const eventStore = useEventStore();
const events = ref([]);

const getAllLocations = async () => {
  try {
    const response = await locationStore.getLocations();
    locations.value = response;
  } catch (err) {
    console.error(err);
  }
};

const getEventsByCity = async (city) => {
  try {
    const response = await eventStore.getEventsByCity(city);
    events.value = response;
  } catch (err) {
    console.error(err);
  }
};

const getEventsByCountry = async (country) => {
  try {
    const response = await eventStore.getEventsByCountry(country);
    events.value = response;
  } catch (err) {
    console.error(err);
  }
};

const uniqueCountries = computed(() => {
  const countrySet = new Set();
  locations.value.forEach(location => {
    countrySet.add(location.country);
  });
  return Array.from(countrySet);
});

onMounted(async () => {
  await getAllLocations();
});

watch([filterBy, selectedCity, selectedCountry], async ([newFilterBy, newSelectedCity, newSelectedCountry]) => {
  if (newFilterBy === 'city' && newSelectedCity) {
    await getEventsByCity(newSelectedCity);
  } else if (newFilterBy === 'country' && newSelectedCountry) {
    await getEventsByCountry(newSelectedCountry);
  }
});
</script>

<template>
  <div class="container mt-5">
    <h3 class="event-title">Discover Local Happenings: Your Personalized Event Guide!</h3>
    <p class="lead text-center mt-2">
      Whether you're looking for concerts, festivals, workshops, or local meetups, we've got you covered. Our platform brings you the latest and most exciting events happening in your area, tailored to your interests and location. 
    </p>
    <div class="location-selector d-flex">
      <div class="mb-3 mr-3">
        <label class="form-label" for="filterSelect">Filter By</label>
        <select id="filterSelect" class="form-select" v-model="filterBy">
          <option value="">Select Filter</option>
          <option value="city">City</option>
          <option value="country">Country</option>
        </select>
      </div>
      <div class="mb-3" v-if="filterBy === 'city'">
        <label class="form-label" for="citySelect">City</label>
        <select id="citySelect" class="form-select" v-model="selectedCity">
          <option v-for="location in locations" :key="location.id" :value="location.city">
            {{ location.city }}
          </option>
        </select>
      </div>
      <div class="mb-3" v-if="filterBy === 'country'">
        <label class="form-label" for="countrySelect">Country</label>
        <select id="countrySelect" class="form-select" v-model="selectedCountry">
          <option v-for="country in uniqueCountries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>
    </div>
    <div class="events-list mt-4 d-flex">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>
  </div>
</template>

<style scoped>
.event-title {
  font-size: 2.5rem;
  font-weight: 600;
  background: -webkit-linear-gradient(60deg, #0f0101, #5f6877);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}
.mr-3 {
  margin-right: 1rem;
}
.events-list{
  flex-wrap: wrap;
}
</style>
