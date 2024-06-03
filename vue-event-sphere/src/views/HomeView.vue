
<script setup>
import { useCategoryStore } from '@/store/categoryStore';
import { useEventStore } from '@/store/eventStore';
import { onMounted, ref } from 'vue';
import EventCard from '@/components/EventCard.vue';

const categoryStore = useCategoryStore();
const eventStore = useEventStore();

// Use refs to make categoryNames and eventsByCategoryId reactive
const categoryNames = ref([]);
const eventsByCategoryId = ref({});

onMounted(async () => {
    const categories = await categoryStore.getAllCategories();
    categoryNames.value = categories.map(category => category.categoryName);

    const eventsPromises = categories.map(async category => {
        const events = await eventStore.getEventByCategory(category.id);
        return { categoryId: category.id, categoryName: category.categoryName, events };
    });

    const results = await Promise.all(eventsPromises);
    results.forEach(({ categoryId, categoryName, events }) => {
        eventsByCategoryId.value[categoryId] = { categoryName, events };
    });

    console.log(eventsByCategoryId.value);
});
</script>


<template>
    <div>
      <div class="top-banner__item is-ref">
        <img
          class="top-banner__image w-100"
          src="https://imgs.ticombo.com/tc-images-main/origin/events/music/ac-slash-dc/acdcB.png"
          alt="AC-DC - PWR-UP Tour"
          style="height: 400px;"
        />
      </div>
  
      <br />
  
      <div v-for="(category, categoryId) in eventsByCategoryId" :key="categoryId" class="">
        <h2 class="text-center">{{ category.categoryName }}</h2>
        <div class="d-flex justify-content-center">
          <EventCard v-for="event in category.events" :key="event.id" :event="event" />
        </div>
      </div>
    </div>
  </template>
  
  


