<template>
    <div class="recommended-events" v-if="COMPEvent.length > 0">
        <h2 class="text-center mb-4">Events you might be interested in <span>{{ AuthStore.userName }}</span></h2>
        <div>
            <div class="d-flex flex-wrap justify-content-center">
                <div class="d-flex justify-content-center flex-wrap" v-for="event in COMPEvent.slice(-4)" :key="event.id">
                    <EventCard :event="event" />
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
import EventCard from './EventCard.vue';

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
span{
    color: #4a7ab8;
    text-transform: capitalize;
}
</style>
