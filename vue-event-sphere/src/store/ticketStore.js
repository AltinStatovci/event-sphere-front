import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTicketStore = defineStore('ticket', () => {
  const url = 'http://localhost:5220/api/';
  const tickets = ref([]);
  const ticket = ref();

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
  async function getTicketById(id) {
    try {
        const response = await axios.get(`${url}Ticket/${id}`);
        const ticketData = response.data;

        const fetchedTicket = {
            id: ticketData.id,
            eventID: ticketData.eventID,
            ticketType: ticketData.ticketType,
            price: ticketData.price,
            bookingReference: ticketData.bookingReference
        };
        
        ticket.value = fetchedTicket;
        return fetchedTicket;
    } catch (err) {
        console.error('Error fetching event:', err);
        return null;
    }
}

  return { tickets, getTicketByEvent, getTicketById};
});
