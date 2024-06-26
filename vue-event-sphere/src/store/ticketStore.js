import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import client from "@/helpers/client.js";
import {useAuthStore} from "@/store/authStore.js";

export const useTicketStore = defineStore('ticket', () => {
  const authStore = useAuthStore();
  const url = 'http://localhost:5220/api/';
  const tickets = ref([]);
  
  const getTickets = async () => {
    try {
      const response = await client.get(`${url}Ticket`);
      return response.data;
    } catch (err) {
      console.error('Error fetching tickets:', err);
      return [];
    }
  };

  const getTicketById = async (id) => {
    try {
      const response = await client.get(`${url}Ticket/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching ticket by ID:', err);
      return null;
    }
  };

  const addTicket = async (ticketData) => {
    try {
      const response = await client.post(`${url}Ticket`, ticketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateTicket = async (ticketData) => {
    try {
      const response = await client.put(`${url}Ticket/${ticketData.id}`, ticketData);
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`${url}Ticket/${ticketId}`,{
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  };
  async function getTicketByEvent(eventId) {
    try {
      const response = await client.get(`${url}Ticket/${eventId}/event`);
      const data = response.data;
      tickets.value = data.map(ticket => ({
        id: ticket.id,
        eventName: ticket.eventName,
        price: ticket.price,
        ticketType: ticket.ticketType,
        bookingReference: ticket.bookingReference,
      }));
    } catch (err) {
      console.log(err);
    }
  }

  return {
    getTickets,
    getTicketById,
    addTicket,
    updateTicket,
    deleteTicket,
    getTicketByEvent,
    tickets
  };
});
