<template>
    <div class="recommended-events">
        <h2 class="text-center mb-4">Recommended Events</h2>
        <div v-if="COMPEvent.length === 0" class="text-center">
            <p>No recommended events available.</p>
        </div>
        <div v-else>
            <div class="d-flex flex-wrap justify-content-center">
                <div v-for="event in COMPEvent" :key="event.id" class="event-card mx-2 my-3">
                    <img :src="`data:image/png;base64,${event.photoData}`" class="card-img-top" alt="Event Image">
                    <div class="card-body">
                        <h5 class="card-title">{{ event.eventName }}</h5>
                        <p class="card-text">{{ formatDateString(event.startDate) }} - {{
            formatDateString(event.endDate) }}</p>
                        <p class="card-text" v-if="event.location">{{ event.location.city }}, {{ event.location.country
                            }}</p>
                        <p class="card-text">Tickets left: <strong>{{ event.availableTickets }}</strong></p>
                        <div class="text-center">
                            <button @click="() => goToEvent(event.id)" class="btn btn-primary">
                                Find out more
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useEventStore } from '@/store/eventStore.js';
import { useRCEventStore } from '@/store/RceventStore.js';
import { useAuthStore } from '@/store/authStore.js';
import { useRouter } from 'vue-router';

const eventStore = useEventStore();
const RceventStore = useRCEventStore();
const AuthStore = useAuthStore();
const router = useRouter();

const ff = ref([]);
const COMPEvent = ref([]);

const fetchUserRCEventsByUserId = async () => {
    try {
        const userId = AuthStore.id;
        ff.value = await RceventStore.GetRCEventsByUserId(userId);
        console.log("User RCEvents:", ff.value);
    } catch (err) {
        console.error("Error fetching user RCEvents:", err);
    }
};

const fetchAllEvents = async () => {
    try {
        const filteredRCEvents = ff.value.filter(rcEvent => rcEvent.ecount > 0);
        const eventPromises = filteredRCEvents.map(rcEvent => eventStore.getEventById(rcEvent.eventId));
        COMPEvent.value = await Promise.all(eventPromises);
        console.log("Filtered Events:", COMPEvent.value);
    } catch (err) {
        console.error("Error fetching all events:", err);
    }
};

const goToEvent = (eventId) => {
    const redirectUrl = `/eventdetails/${eventId}`;
    router.push(redirectUrl);
};

const formatDateString = (dateString) => {
    const monthsFull = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthsFull[monthIndex]} ${year}`;
};

onMounted(async () => {
    await fetchUserRCEventsByUserId();
    fetchAllEvents();
});
</script>

<style scoped>
.recommended-events {
    padding: 20px;
}

.event-card {
    width: 23rem;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    background-color: #fff;
}

.event-card:hover {
    transform: scale(1.05);
}

.card-img-top {
    height: 250px;
    object-fit: cover;
    width: 100%;
}

.card-body {
    padding: 20px;
}

.card-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
}

.card-text {
    color: #666;
}

.btn-primary {
    background-color: #d75a00;
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
}

.btn-primary:hover {
    background-color: #4a7ab8;
}
</style>
