import { defineStore } from 'pinia';
import axios from 'axios';

export const useTicketStore = defineStore('ticket', () => {
  const url = 'http://localhost:5220/api/';
  
  const getTickets = async () => {
    try {
      const response = await axios.get(`${url}Ticket`);
      return response.data;
    } catch (err) {
      console.error('Error fetching tickets:', err);
      return [];
    }
  };

  const getTicketById = async (id) => {
    try {
      const response = await axios.get(`${url}Ticket/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching ticket by ID:', err);
      return null;
    }
  };

  const addTicket = async (ticketData) => {
    try {
      const response = await axios.post(`${url}Ticket`, ticketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateTicket = async (ticketData) => {
    try {
      const response = await axios.put(`${url}Ticket/${ticketData.id}`, ticketData);
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`${url}Ticket/${ticketId}`);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  };

  return {
    getTickets,
    getTicketById,
    addTicket,
    updateTicket,
    deleteTicket
  };
});
