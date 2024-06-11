<script setup>
import { useEventStore } from '@/store/eventStore';
import { onMounted, ref } from 'vue';

const loading = ref(false);
const error = ref(null);

const getLocation = () => {
  loading.value = true;
  error.value = null;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    error.value = "Geolocation is not supported by this browser.";
    loading.value = false;
  }
};

const showPosition = (position) => {
  console.log('Latitude: ', position.coords.latitude);
  console.log('Longitude: ', position.coords.longitude);
  loading.value = false;
  var result = getCityFromCoordinates("42.467328", "21.46304");
  console.log(result);
};

const showError = (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      error.value = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      error.value = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      error.value = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      error.value = "An unknown error occurred.";
      break;
  }
  loading.value = false;
};
const getCityFromCoordinates = async (lat, lon) => {
  try {
    const apiKey = "6668455761287514129029laqde0b24"; // Replace with your geocoding service API key
    const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Data:", data);
    
    const city = data.address.city;
    location.value = city ? `City: ${city}` : "City not found";
    console.log(city);
    var result = await eventStore.getEventsByLocation(city);
    console.log(result);
  } catch (error) {
    console.error("Error getting city from coordinates:", error);
    location.value = "Error getting city from coordinates.";
  }
};
const eventStore = useEventStore();

onMounted(async() => {
    var result = await eventStore.getEventsByLocation()
    console.log(result);
})


</script>


<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Get Your Location</h1>
    <div class="d-flex justify-content-center">
      <button @click="getLocation" class="btn btn-primary">
        Find Location
      </button>
    </div>
    <div class="text-center mt-4" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p>Loading...</p>
    </div>
    <div class="alert alert-danger mt-4" v-if="error">{{ error }}</div>
  </div>
</template>
<style scoped>

</style>