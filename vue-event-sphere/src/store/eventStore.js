import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useEventStore = defineStore('event', () => {
    const url = 'http://localhost:5220/api/';
    const events = ref([]);

    async function getEventByCategory(id) {
        try {
            const response = await axios.get(`${url}Event/${id}/eventCategory`);
            const eventData = response.data;
            
            const allEvents = eventData.map(event => ({
                id: event.id,
                eventName: event.eventName,
                description: event.description,
                location: event.location,
                startDate: event.startDate,
                endDate: event.endDate,
                category: event.categoryID,
            }));

            events.value = allEvents; // Store the events in the state
            console.log(allEvents);
            return allEvents;
        } catch (err) {
            console.error('Error fetching events:', err);
            return [];
        }
    }

    return { getEventByCategory }; // Return the function so it can be used in components
});
