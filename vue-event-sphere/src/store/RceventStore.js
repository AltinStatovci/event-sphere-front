import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import client from "@/helpers/client.js";

export const useRCEventStore = defineStore('rcevent', () => {
    const url = 'http://localhost:5220/api/';
    const rcEvents = ref([]);
    const rcEvent = ref(null);

    async function fetchRCEvents() {
        try {
            const response = await client.get(`${url}rcevent`);
            rcEvents.value = response.data;
        } catch (err) {
            console.error("Error fetching RCEvents:", err);
        }
    }

    async function getRCEventById(id) {
        try {
            const response = await client.get(`${url}rcevent/${id}`);
            rcEvent.value = response.data;
            return rcEvent.value;
        } catch (err) {
            console.error("Error fetching RCEvent:", err);
            return null;
        }
    }

    async function getRCEventByUserIdAndEventId(userId, eventId) {
        try {
            const response = await client.get(`${url}rcevent/user/${userId}/event/${eventId}`);
            rcEvent.value = response.data;
            return rcEvent.value;
        } catch (err) {
            console.error("Error fetching RCEvent by UserId and EventId:", err);
            return null;
        }
    }

    async function submitRCEvent(rcEventData) {
        try {
            const response = await client.post(`${url}rcevent`, rcEventData);
            fetchRCEvents(); // Refresh the RCEvents list
            return response.data;
        } catch (err) {
            console.error("Error submitting RCEvent:", err);
        }
    }

    async function updateRCEvent(userId, eventId) {
        try {
            // Fetch the existing event
            const response = await axios.get(`${url}rcevent/user/${userId}/event/${eventId}`);
            const existingEvent = response.data;
            // Increment the ecount
            existingEvent.ecount += 1;
            // Update the event
            const updateResponse = await axios.put(`${url}rcevent/${existingEvent.id}`, existingEvent);
            fetchRCEvents(); // Refresh the RCEvents list
            return updateResponse.data;
        } catch (err) {
            console.error("Error updating RCEvent:", err);
        }
    }

    async function deleteRCEvent(id) {
        try {
            await client.delete(`${url}rcevent/${id}`);
            fetchRCEvents(); // Refresh the RCEvents list
        } catch (error) {
            console.error('Error deleting RCEvent:', error);
            throw error;
        }
    }
    async function checkRCEventExists(userId, eventId) {
        try {
            const response = await client.get(`${url}rcevent/exists/user/${userId}/event/${eventId}`);
            return response.data; // Returns true or false based on existence
        } catch (err) {
            console.error("Error checking RCEvent existence:", err);
            return false;
        }
    }
    const GetRCEventsByUserId = async (userId) => {
        try {
            const response = await client.get(`${url}rcevent/GetRCEventsByUserId/${userId}`);
            rcEvents.value = response.data;
            return rcEvents.value;
        } catch (err) {
            console.error("Error fetching RCEvents by UserId:", err);
            return [];
        }
    };
    

    return { rcEvents, rcEvent, fetchRCEvents,checkRCEventExists, GetRCEventsByUserId,getRCEventById, getRCEventByUserIdAndEventId, submitRCEvent, updateRCEvent, deleteRCEvent };
});
