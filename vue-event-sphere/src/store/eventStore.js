import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import client from "@/helpers/client.js";

export const useEventStore = defineStore("event", () => {
  const url = "http://localhost:5220/api/";
  const events = ref([]);
  const filteredEvents = ref([]);
  const eventsByLocation = ref([]);
  const event = ref(null);

  async function getEventByCategory(id) {
    try {
      const response = await axios.get(`${url}Event/${id}/eventCategory`);
      const eventData = response.data;

      const allEvents = eventData.map((event) => ({
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
      }));

      events.value = allEvents;
      console.log(allEvents);

      events.value = allEvents; // Store the events in the state

      return allEvents;
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  }

  async function getEventByOrganizer(id) {
    try {
      const response = await axios.get(`${url}Event/${id}/organizer`);
      const eventData = response.data;

      const allEvents = eventData.map((event) => ({
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
      }));

      events.value = allEvents;
      console.log(allEvents);

      events.value = allEvents; // Store the events in the state

      return allEvents;
    } catch (err) {
      console.error("Error fetching events:", err);
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
      };

      event.value = fetchedEvent;

      return fetchedEvent;
    } catch (err) {
      console.error("Error fetching event:", err);
      return null;
    }
  }
  async function getEvents() {
    try {
      const response = await axios.get(`${url}Event`);
      const eventData = response.data;

      const allEvents = eventData.map((event) => ({
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
      }));
      events.value = allEvents;
      console.log(events.value);
      return allEvents;
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  }
  async function getEventsByCity(city) {
    try {
      const response = await axios.get(`${url}Event/${city}/city`);
      const eventData = response.data;

      const allEvents = eventData.map((event) => ({
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
      }));

      events.value = allEvents;
      console.log(allEvents);

      events.value = allEvents;

      return allEvents;
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  }
  async function getEventsByCountry(country) {
    try {
      const response = await axios.get(`${url}Event/${country}/country`);
      const eventData = response.data;

      const allEvents = eventData.map((event) => ({
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
      }));

      events.value = allEvents;
      console.log(allEvents);

      events.value = allEvents;

      return allEvents;
    } catch (err) {
      console.error("Error fetching events:", err);
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
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async function updateEvent(event) {
    try {
      const formData = new FormData();
      formData.append("EventName", event.eventName);
      formData.append("Description", event.description);
      formData.append("Address", event.address);
      formData.append("LocationId", event.locationId);
      formData.append("StartDate", event.startDate);
      formData.append("EndDate", event.endDate);
      formData.append("CategoryID", event.categoryID);
      formData.append("OrganizerID", event.organizerID);
      formData.append("MaxAttendance", event.maxAttendance);
      formData.append("AvailableTickets", event.availableTickets);
      formData.append("DateCreated", event.dateCreated);

      if (event.image) {
        formData.append("newImage", event.image);
      }

      const response = await axios.put(`${url}Event/${event.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteEvent(eventId) {
    try {
      await axios.delete(`${url}Event/${eventId}`);
    } catch (error) {
      console.error("Error deleting expenses:", error);
      throw error;
    }
}
    async function getEventsByName(name) {
      try {
        const response = await axios.get(`${url}Event/getEventsByName`, {
          params: { name: name },
        });
        const eventData = response.data;

        const filteredEventsByName = eventData.map((event) => ({
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
        }));
        filteredEvents.value = filteredEventsByName;
        return filteredEventsByName;
      } catch (err) {
        console.error("Error fetching events:", err);
        return [];
      }
    }
  
  return {
    getEventByCategory,
    getEventByOrganizer,
    getEventById,
    addEvent,
    updateEvent,
    getEvents,
    deleteEvent,
    event,
    getEventsByCity,
    getEventsByCountry,
    getEventsByName
  };
});
