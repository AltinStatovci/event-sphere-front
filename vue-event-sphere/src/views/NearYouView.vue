<script setup>
import { useLocationStore } from '@/store/locationStore';
import { onMounted, ref, computed } from 'vue';

const locationStore = useLocationStore();
const locations = ref([]);
const filterBy = ref('');

const getAllLocations = async () => {
  try {
    const response = await locationStore.getLocations();
    locations.value = response;
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
  console.log(locations.value);
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
        <select id="citySelect" class="form-select">
          <option v-for="location in locations" :key="location.id" :value="location.id">
            {{ location.city }}
          </option>
        </select>
      </div>
      <div class="mb-3" v-if="filterBy === 'country'">
    <label class="form-label" for="countrySelect">Country</label>
    <select id="countrySelect" class="form-select">
      <option v-for="country in uniqueCountries" :key="country" :value="country">
        {{ country }}
      </option>
    </select>
  </div>
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
.mr-3{
  margin-right: 1rem;  
}
</style>
