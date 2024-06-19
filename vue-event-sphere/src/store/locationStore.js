import { ref } from 'vue';
import axios from 'axios';
import { defineStore } from 'pinia';

export const useLocationStore = defineStore('location', () => {
    const url = 'http://localhost:5220/api/';

    async function getLocations() {
        try {
            const response = await axios.get(`${url}Location`);
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
    return {getLocations}
})