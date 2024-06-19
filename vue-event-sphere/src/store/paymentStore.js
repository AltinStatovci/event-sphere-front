import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const usePaymentStore = defineStore('payment', () => {
    const url = 'http://localhost:5220/api/';
    const payments = ref([]);
    const payment = ref();
    const amount = ref(0);

    async function getPaymentByTicket(ticketId){
        try{
            const response = await axios.get(`${url}Payment/${ticketId}/ticket`);
            const data = response.data;
            payments.value = data.map(payment => ({
                id: payment.id,
                userID: payment.userID,
                ticketId: payment.ticketId,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                paymentDate: payment.paymentDate
            }));
        }catch(err){
            console.log(err);
        }
    }
    async function getPaymentById(id){
        try{
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
            payment.value= fetchedPayment;
            return fetchedPayment;
        }catch(err){
            console.error("error fetching payment: ", err);
            return null;
        }
    }
    return { payments, amount,  getPaymentByTicket, getPaymentById};
});