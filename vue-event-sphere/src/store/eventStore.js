import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import client from "@/helpers/client.js";

export const useEventStore = defineStore('event', () => {
    const url = 'http://localhost:5220/api/';
    const events = ref([]);
    const event = ref(null);

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
                category: event.categoryId,
                photoData: event.photoData
            }));

            events.value = allEvents; // Store the events in the state
            console.log(allEvents);
            return allEvents;
        } catch (err) {
            console.error('Error fetching events:', err);
            return [];
        }
    }
    async function getEventById(id) {
        try {
            const response = await axios.get(`${url}Event/${id}`);
            const eventData = response.data;

            const fetchedEvent = {
                id: eventData.id,
                eventName: eventData.eventName,
                description: eventData.description,
                location: eventData.location,
                startDate: eventData.startDate,
                endDate: eventData.endDate,
                image: eventData.image,
                organizer: eventData.organizer,
                maxAttendance: eventData.maxAttendance,
                availableTickets: eventData.availableTickets,
                photoData: eventData.photoData, 
            };

            event.value = fetchedEvent;
            console.log('Fetched event:', fetchedEvent);
            return fetchedEvent;
        } catch (err) {
            console.error('Error fetching event:', err);
            return null;
        }


    }

    async function addEvent(event) {
        try {
          const formData = new FormData();
          for (const key in event) {
            let value = event[key];
            formData.append(key, value);
            console.log(`Key: ${key}, Value: ${value}`);
          }
          const response = await client.post(`${url}Event`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          return response.data; 
        } catch (error) {
          throw error; 
        }
      }
      
    return { getEventByCategory, getEventById,addEvent ,event }; // Return the function so it can be used in components
});
