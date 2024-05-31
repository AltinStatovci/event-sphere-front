import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useEventStore = defineStore('event', () => {
    const url = 'http://localhost:5220/api/';
    const events = ref([]);
    const category = ref([]);

    async function getAllCategories() {
        try {
            const response = await axios.get(`${url}EventCategory`);
            const data = response.data;
            category.value = data; // Store the categories in the state
            return data;
        } catch (err) {
            console.error('Error fetching categories:', err);
            return [];
        }
    }

    async function getEventByCategory() {
        try {
            const categoryData = await getAllCategories();
            const allEvents = [];

            for (let i = 0; i < categoryData.length; i++) {
                const response = await axios.get(`${url}Event/${categoryData[i].id}/eventCategory`);
                const eventData = response.data;
                const eventsForCategory = eventData.map(event => ({
                    id: event.id,
                    eventName: event.eventName,
                }));
                allEvents.push(...eventsForCategory);
            }

            events.value = allEvents; // Store the events in the state
            console.log(allEvents);
            console.log(category.value); // Access the reactive ref directly
            return allEvents;
        } catch (err) {
            console.error('Error fetching events:', err);
            return [];
        }
    }

    return { getEventByCategory, getAllCategories, events, category }; // Return refs so they can be used in components
});
