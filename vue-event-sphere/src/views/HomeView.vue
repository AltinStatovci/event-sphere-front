<!-- <script setup>
import { useCategoryStore } from '@/store/categoryStore';
import { onMounted } from 'vue';
import {useEventStore} from '@/store/eventStore';
import {computed, reactive, ref} from "vue";
import EventCard from '@/components/EventCard.vue';
const categoryStore = useCategoryStore();
const eventStore = useEventStore();
var eventsByCategoryId;


onMounted(async () => {
    const categoryArray = await categoryStore.getAllCategoryIds();
    for (const categoryId of categoryArray) {
        eventsByCategoryId = eventStore.getEventByCategory(categoryId);
    }
    console.log(eventsByCategoryId);
});
</script> -->

<script setup>
import { useCategoryStore } from '@/store/categoryStore';
import { useEventStore } from '@/store/eventStore';
import { onMounted, ref } from 'vue';
import EventCard from '@/components/EventCard.vue';

const categoryStore = useCategoryStore();
const eventStore = useEventStore();

// Use ref to make eventsByCategoryId reactive
const eventsByCategoryId = ref({});

onMounted(async () => {
    const categoryArray = await categoryStore.getAllCategoryIds();
    const eventsPromises = categoryArray.map(async categoryId => {
        const events = await eventStore.getEventByCategory(categoryId);
        return { categoryId, events };
    });

    const results = await Promise.all(eventsPromises);
    results.forEach(({ categoryId, events }) => {
        eventsByCategoryId.value[categoryId] = events;
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
  
      <div v-for="(events, categoryId) in eventsByCategoryId" :key="categoryId" class="d-flex justify-content-center my-5">
        <h2>{{ categoryId }}</h2>
        <EventCard v-for="event in events" :key="event.id" :event="event" />
      </div>
    </div>
  </template>
  


