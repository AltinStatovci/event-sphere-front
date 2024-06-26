import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const usePaymentStore = defineStore('payment', () => {
    const url = 'http://localhost:5220/api/';
    const payments = ref([]);
    const payment = ref(null);
    const amount = ref(0);

    async function getPaymentByTicket(ticketId) {
        try {
            const response = await axios.get(`${url}Payment/${ticketId}/ticket`);
            const data = response.data;
            payments.value = data.map(payment => ({
                id: payment.id,
                userID: payment.userID,
                userName: payment.userName,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                paymentDate: payment.paymentDate,
                ticketId: payment.ticketID,
                ticketName: payment.ticketName
            }));
        } catch (err) {
            console.log(err);
        }
    }

    async function getPaymentById(id) {
        try {
            const response = await axios.get(`${url}Payment/${id}`);
            const paymentData = response.data;

            const fetchedPayment = {
                id: paymentData.id,
                userID: paymentData.userID,
                ticketId: paymentData.ticketId,
                amount: paymentData.amount,
                paymentMethod: paymentData.paymentMethod,
                paymentStatus: paymentData.paymentStatus,
                paymentDate: paymentData.paymentDate
            };
            payment.value = fetchedPayment;
            return fetchedPayment;
        } catch (err) {
            console.error("error fetching payment: ", err);
            return null;
        }
    }

    async function getPaymentsByUserId(userId) {
        try {
            const response = await axios.get(`${url}Payment/user/${userId}`);
            payments.value = response.data;
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    }

    async function getPaymentsByEvent(eventId) {
        try {
            const response = await axios.get(`${url}Payment/event/${eventId}`);
            payments.value = response.data;
        } catch (error) {
            console.error('Error fetching payments by event ID:', error);
        }
    }
    async function getAllPayments() {
        try {
          const response = await axios.get(`${url}Payment/all`);
          payments.value = response.data;
        } catch (error) {
          console.error('Error fetching all payments:', error);
        }
      }
    return { payments, amount, getPaymentByTicket, getPaymentById, getPaymentsByUserId, getPaymentsByEvent,getAllPayments };
});
