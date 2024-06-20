<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/store/eventStore';
import EventDetailsCard from '@/components/EventDetailsCard.vue'; 

const route = useRoute();
const eventId = route.params.id; 

const eventStore = useEventStore();

let eventDetails = computed(() => eventStore.event);

onMounted(async () => {
  await eventStore.getEventById(eventId);
});

</script>

<template>
  <div v-if="eventDetails">
    <EventDetailsCard :event="eventDetails"/>
  </div>
</template>

<style scoped></style>
