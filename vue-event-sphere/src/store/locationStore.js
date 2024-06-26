import { ref } from 'vue';
import axios from 'axios';
import { defineStore } from 'pinia';
import client from "@/helpers/client.js";

export const useLocationStore = defineStore('location', () => {
    const url = 'http://localhost:5220/api/';
    const location = ref(null);

    async function getLocations() {
        try {
            const response = await client.get(`${url}Location`);
            const locations = response.data;
  
            const allLocations = locations.map(location => ({
                id: location.id,
                city: location.city,
                country: location.country,
            }));
  
            locations.value = allLocations; 
            return allLocations;
        } catch (err) {
            console.error('Error fetching events:', err);
            return [];
        }
    }
    async function getLocationById(id) {
        try {
            const response = await client.get(`${url}Location/${id}`);
            const locationData = response.data;

            const fetchedLocation = {
                id: locationData.id,
                city: locationData.city,
                country: locationData.country,
            };

            location.value = fetchedLocation;
            return fetchedLocation;
        } catch (err) {
            console.error('Error fetching event:', err);
            return null;
        }


    }
    return {getLocations, getLocationById, location}
})