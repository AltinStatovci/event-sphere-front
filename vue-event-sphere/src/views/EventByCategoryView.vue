<script setup>
import {useCategoryStore} from '@/store/categoryStore';
import {useEventStore} from '@/store/eventStore';
import {onMounted, ref, watch} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import EventCard from "@/components/EventCard.vue";

const categoryStore = useCategoryStore();
const eventStore = useEventStore();
const eventsByCategoryId = ref({});
const router = useRouter();
const route = useRoute();
const categoryId = ref(route.params.id);

const getData = async (id) => {
  let events = await eventStore.getEventByCategory(id);
  
  const now = new Date();
  events = events.filter(event => event.isApproved && new Date(event.scheduleDate) < now);
  
  eventsByCategoryId.value[id] = events;
}

onMounted(async () => {
  await getData(categoryId.value);
});


watch(
    () => route.params.id,
    async (newId) => {
      categoryId.value = newId;
      await getData(newId);
    }
);
</script>

<template>
  <div>
    <div v-if="eventsByCategoryId[categoryId] && eventsByCategoryId[categoryId].length > 0" class="d-flex justify-content-center flex-wrap">
      <div v-for="event in eventsByCategoryId[categoryId]" :key="event.id">
        <EventCard :event="event"/>
      </div>
    </div>
    <div v-else>
      No Event Here
    </div>
  </div>
</template>



<style scoped>
</style>
