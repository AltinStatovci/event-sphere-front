<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTicketStore } from '@/store/ticketStore';
import TicketCard from '@/components/TicketCard.vue';

const store = useTicketStore();
const route = useRoute();

onMounted(() => {
  const eventId = route.params.id;
  store.getTicketByEvent(eventId);
});
</script>

<template>
    <div>
      <div>
        <TicketCard :ticket="ticket" />
      </div>
    </div>
  </template>

<style scoped>

</style>
  

  
