import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTicketStore = defineStore('ticket', () => {
  const url = 'http://localhost:5220/api/';
  const tickets = ref([]);

  async function getTicketByEvent(eventId) {
    try {
      const response = await axios.get(`${url}Ticket/${eventId}/event`);
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

  return { tickets, getTicketByEvent };
});
