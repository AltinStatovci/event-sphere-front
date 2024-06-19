<script setup>
import { useCategoryStore } from '@/store/categoryStore';
import { useEventStore } from '@/store/eventStore';
import { onMounted, ref, computed } from 'vue';
import EventCard from '@/components/EventCard.vue';
import {useAuthStore} from "@/store/authStore.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const eventStore = useEventStore();

const categoryNames = ref([]);
const eventsByCategoryId = ref({});

const slideshowEvents = ref([]);

const currentSlide = ref(0);

const updateSlideOpacity = () => {
  const slides = document.querySelectorAll('.slideshow-item');
  slides.forEach((slide, index) => {
    slide.style.opacity = index === currentSlide.value ? 1 : 0;
  });
};
const nextSlide = () => {
  const slides = document.querySelectorAll('.slideshow-item');
  if (slides.length > 0) {
    slides[currentSlide.value].style.opacity = 0;
    currentSlide.value = (currentSlide.value + 1) % slides.length;
    slides[currentSlide.value].style.opacity = 1;
  }
};

const previousSlide = () => {
  const slides = document.querySelectorAll('.slideshow-item');
  if (slides.length > 0) {
    slides[currentSlide.value].style.opacity = 0;
    currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
    slides[currentSlide.value].style.opacity = 1;
  }
};

const formatDate = (dateString) => {
  return dateString.split('T')[0]; // Splits the string at 'T' and returns the date part
};

onMounted(async () => {

  console.log("user id : "+ authStore.id)
  console.log("isADmin : "+authStore.isAdmin)
  console.log("email:" + authStore.email)

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
  slideshowEvents.value = results.flatMap(result => result.events).slice(0, 5); // Adjust as needed

  console.log(eventsByCategoryId.value);
  console.log(categories);
  console.log(slideshowEvents.value); // Log slideshow events for debugging

   setInterval(() => {
    nextSlide();
  }, 14000);
});

const filteredCategories = computed(() => {
  return Object.values(eventsByCategoryId.value).filter(category => category.events && category.events.length > 0);
});
function goToTicket(id) {
  const redirectUrl = `/Ticket/${id}/event`;
  router.push(redirectUrl);
}
</script>


<template>
  <div>
      <div class="top-banner__item is-ref">
      <div id="slideshow">
        <div v-for="(event, index) in slideshowEvents" :key="index" class="slideshow-item">
        <div class="event-info">
            <p class="event-name">{{ event.eventName }}</p>
            <p class="small">Event description: {{ event.description }}</p>
            <p class="small">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path d="M12 2C8.1 2 5 5.1 5 9c0 4.4 5.1 11.2 6.1 12.3.3.4.9.4 1.2 0 1-1.1 6.1-7.9 6.1-12.3 0-3.9-3.1-7-7-7zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>Event location: {{ event.location }}</p>
            <p class="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path d="M5 2v2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V2h-2v2H7V2H5zm0 4h14v14H5V6zm2 4v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/>
              </svg> Event start date: {{ formatDate(event.startDate) }}</p>
            <p class="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path d="M5 2v2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V2h-2v2H7V2H5zm0 4h14v14H5V6zm2 4v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/>
              </svg> Event end date: {{ formatDate(event.endDate) }}</p>
            
            <button @click="() => goToTicket(event.id)" class="btn btn-primary">Buy Ticket</button>
          </div>
          <img
            class="top-banner__image washed-out"
            :src="`data:image/png;base64,${event.photoData}`"
            :alt="event.eventName"
          />
        </div>
        <button class="btn btn-primary nav-button left" @click="previousSlide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M15 18l-6-6 6-6"/>
</svg>

        </button>
        <button class="btn btn-primary nav-button right" @click="nextSlide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M9 6l6 6-6 6"/>
</svg>

        </button>
      </div>
    </div>
    
    <br />

    <div v-for="(category, categoryId) in filteredCategories" :key="categoryId" class="">
      <h2 class="text-center">{{ category.categoryName }}</h2>
      <div class="d-flex justify-content-center flex-wrap">
        <EventCard v-for="event in category.events" :key="event.id" :event="event" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#top-banner__item is-ref{
  height:100%;
}
#slideshow {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.slideshow-item {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: opacity 1s ease-in-out;
  opacity: 0;
}

.slideshow-item:first-child {
  opacity: 1; /* Ensure the first slide is visible initially */
}

.slideshow-item img {
  width: 100%;
  height: 100%;
 /* Ensures images cover the container without white spaces */
  object-position: center; /* Keeps the image centered */
}
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
}

.nav-button.left {
  left: 10px;
}

.nav-button.right {
  right: 10px;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.event-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}
.event-name {
  font-size: 24px;
  font-weight: bold;
}
.event-description {
  font-size: 18px;
}
.event-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2; /* Increased z-index to appear above the image */
}
.washed-out {
  filter: brightness(20%); /* Adjust brightness percentage as needed */
}
.small {
  font-size: 14px; /* Adjust the font size as needed */
}
.icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 5px;
}
</style>

