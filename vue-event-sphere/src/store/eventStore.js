import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import client from "@/helpers/client.js";

export const useEventStore = defineStore('event', () => {
  const url = 'http://localhost:5220/api/';
  const events = ref([]);
  const eventsByLocation = ref([]);
  const event = ref(null);
  const filteredEvents = ref([]);

  async function getEventByCategory(id) {
    try {
      const response = await client.get(`${url}Event/${id}/eventCategory`);
      const eventData = response.data;

      const allEvents = eventData.map(event => ({
        id: event.id,
        eventName: event.eventName,
        description: event.description,
        address: event.address,
        locationId: event.locationId,
        startDate: event.startDate,
        endDate: event.endDate,
        category: event.categoryID,
        availableTickets: event.availableTickets,
        photoData: event.photoData,
        isApproved: event.isApproved
      }));


      events.value = allEvents;
      console.log(allEvents);

      events.value = allEvents; // Store the events in the state

      return allEvents;
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  }


  async function getEventByOrganizer(id) {
    try {
      const response = await client.get(`${url}Event/${id}/organizer`);
      const eventData = response.data;

      const allEvents = eventData.map(event => ({
        id: event.id,
        eventName: event.eventName,
        description: event.description,
        address: event.address,
        locationId: event.locationId,
        categoryName: event.categoryName,
        startDate: event.startDate,
        endDate: event.endDate,
        image: event.image,
        organizerName: event.organizerName,
        maxAttendance: event.maxAttendance,
        availableTickets: event.availableTickets,
        photoData: event.photoData,
        isApproved: event.isApproved
      }));

      events.value = allEvents;
      console.log("All events:", allEvents);
      return allEvents;
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  }


  async function getEventById(id) {
    try {
      const response = await client.get(`${url}Event/${id}`);
      const eventData = response.data;

      const fetchedEvent = {
        id: eventData.id,
        eventName: eventData.eventName,
        description: eventData.description,
        address: eventData.address,
        locationId: eventData.locationId,
        categoryID: eventData.categoryID,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        image: eventData.image,
        organizerName: eventData.organizerName,
        maxAttendance: eventData.maxAttendance,
        availableTickets: eventData.availableTickets,
        photoData: eventData.photoData,
        isApproved: event.isApproved

      };

      event.value = fetchedEvent;

      return fetchedEvent;
    } catch (err) {
      console.error('Error fetching event:', err);
      return null;
    }


  }
  async function getEvents() {
    try {
      const response = await client.get(`${url}Event`);
      const eventData = response.data;

      const allEvents = eventData.map(event => ({
        id: event.id,
        eventName: event.eventName,
        description: event.description,
        address: event.address,
        locationId: event.locationId,
        categoryName: event.categoryName,
        startDate: event.startDate,
        endDate: event.endDate,
        image: event.image,
        organizerName: event.organizerName,
        maxAttendance: event.maxAttendance,
        availableTickets: event.availableTickets,
        photoData: event.photoData,
        isApproved: event.isApproved
      }));
      events.value = allEvents;
      console.log(events.value);
      return allEvents;
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  }
  async function getEventsByCity(city) {
    try {
      const response = await client.get(`${url}Event/${city}/city`);
      const eventData = response.data;

      const allEvents = eventData.map(event => ({
        id: event.id,
        eventName: event.eventName,
        description: event.description,
        address: event.address,
        locationId: event.locationId,
        startDate: event.startDate,
        endDate: event.endDate,
        category: event.categoryID,
        availableTickets: event.availableTickets,
        photoData: event.photoData,
        isApproved: event.isApproved
      }));


      events.value = allEvents;
      console.log(allEvents);

      events.value = allEvents;

      return allEvents;
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  }

  async function getEventsByName(name) {
    try {
      const response = await client.get(`${url}Event/getEventsByName`, {
        params: { name: name },
      });
      const eventData = response.data;

      const filteredEventsByName = eventData.map((event) => ({
        id: event.id,
        eventName: event.eventName,
        description: event.description,
        address: event.address,
        locationId: event.locationId,
        categoryID: event.categoryID,
        startDate: event.startDate,
        endDate: event.endDate,
        image: event.image,
        organizerName: event.organizerName,
        maxAttendance: event.maxAttendance,
        availableTickets: event.availableTickets,
        photoData: event.photoData,
        isApproved: event.isApproved,
      }));
      filteredEvents.value = filteredEventsByName;
      return filteredEventsByName;
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  }

  async function getEventsByCountry(country) {
    try {
      const response = await client.get(`${url}Event/${country}/country`);
      const eventData = response.data;

      const allEvents = eventData.map(event => ({
        id: event.id,
        eventName: event.eventName,
        description: event.description,
        address: event.address,
        locationId: event.locationId,
        startDate: event.startDate,
        endDate: event.endDate,
        category: event.categoryID,
        availableTickets: event.availableTickets,
        photoData: event.photoData,
        isApproved: event.isApproved
      }));


      events.value = allEvents;
      console.log(allEvents);

      events.value = allEvents;

      return allEvents;
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  }
  async function addEvent(event) {
    try {
      const formData = new FormData();
      for (const key in event) {
        let value = event[key];
        formData.append(key, value);
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
  async function updateEvent(event) {
    try {
      const formData = new FormData();
      formData.append('EventName', event.eventName);
      formData.append('Description', event.description);
      formData.append('Address', event.address);
      formData.append('LocationId', event.locationId);
      formData.append('StartDate', event.startDate);
      formData.append('EndDate', event.endDate);
      formData.append('CategoryID', event.categoryID);
      formData.append('OrganizerID', event.organizerID);
      formData.append('MaxAttendance', event.maxAttendance);
      formData.append('AvailableTickets', event.availableTickets);
      formData.append('DateCreated', event.dateCreated);
      formData.append('IsApproved', event.isApproved);

      if (event.image) {
        formData.append('newImage', event.image);
      }

      const response = await client.put(`${url}Event/${event.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteEvent(eventId) {
    try {
      await client.delete(`${url}Event/${eventId}`);
    }
    catch (error) {
      console.error('Error deleting expenses:', error);
      throw error;

    }
  }

  async function approveEvent(eventId) {
    try {
      await client.post(`${url}Event/approve/${eventId}`)
    }
    catch (error) {
      console.error('Error approving the event', error);
      throw error;
    }
  }
  async function rejectEvent(eventId, message) {
    try {

      const formData = new FormData();
      formData.append("id", eventId);
      formData.append("message", message);

      const response = await client.post(`${url}Event/reject`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error rejecting the event', error.response ? error.response.data : error);
      throw error;
    }
  }

  return { getEventByCategory, getEventsByName, getEventByOrganizer, getEventById, addEvent, updateEvent, getEvents, deleteEvent, event, events, filteredEvents, getEventsByCity, getEventsByCountry, approveEvent, rejectEvent };

});