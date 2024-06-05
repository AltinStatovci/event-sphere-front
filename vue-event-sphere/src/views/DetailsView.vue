<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/store/eventStore';
import EventDetailsCard from '@/components/EventDetailsCard.vue'; // Update with the correct path

const route = useRoute();
const eventId = route.params.id; // Assuming the route has a param named 'id'

const eventStore = useEventStore();

onMounted(async () => {
  await eventStore.getEventById(eventId);
});

const eventDetails = computed(() => eventStore.event);
</script>

<template>
  <EventDetailsCard :event="eventDetails" />
</template>

<style scoped></style>
