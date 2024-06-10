<template>
  <div>
    <h2>Payment Form</h2>
    <form @submit.prevent="submitPayment">
      <div>
        <label for="card-holder-name">Card Holder Name</label>
        <input type="text" id="card-holder-name" v-model="cardHolderName" />
      </div>
      <div id="card-element"></div>
      <button type="submit" :disabled="loading">Pay</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useAuthStore } from "@/store/authStore.js";
import { useTicketStore } from "@/store/ticketStore.js";
import { usePaymentStore } from '@/store/paymentStore';

const cardHolderName = ref('');
const stripe = ref(null);
const cardElement = ref(null);
const loading = ref(false);
const error = ref(null);
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const paymentStore = usePaymentStore();
const ticket = ref(null);

const path = window.location.pathname;
const segments = path.split('/');
const id = segments[segments.length - 1];

onMounted(async () => {
  try {
    ticket.value = await ticketStore.getTicketById(id);
    console.log(ticket.value.id);
  } catch (ticketError) {
    console.error('Error fetching ticket:', ticketError);
    error.value = 'Failed to fetch ticket information.';
  }


  try {
    stripe.value = await loadStripe('pk_test_51PObZ6GXr54oZKBkE9PB2WxDpNwNvkgQyn4uDCwZ0XUW1ozgyZVyquOp5IIQxN6zNlgoHnPZ5TbuGzxosNOgC3S700Ywr18il6');
    const elements = stripe.value.elements();

    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    cardElement.value = elements.create('card', { style });
    cardElement.value.mount('#card-element');
  } catch (stripeError) {
    console.error('Stripe initialization error:', stripeError);
    error.value = 'Failed to initialize payment form.';
  }
});

const submitPayment = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { token, error: stripeError } = await stripe.value.createToken(cardElement.value, {
      name: cardHolderName.value,
    });

    if (stripeError) {
      error.value = stripeError.message;
    } else {
      await processPayment(token.id);
    }
  } catch (err) {
    error.value = 'An error occurred during payment processing.';
  } finally {
    loading.value = false;
  }
};

const processPayment = async (stripeToken) => {
  try {
    const response = await axios.post('http://localhost:5220/api/Payment', {
      userID: authStore.id,  
      ticketID: ticket.value.id,  
      amount: paymentStore.amount,  
      paymentMethod: 'Stripe',
      paymentDate: new Date().toISOString(),
      stripeToken: stripeToken,
      paymentStatus: true
      });
    console.log(response);
    

    if (response.status === 204 || response.status === 201 || response.status === 200) {
      await Swal.fire({
        title: "Payment successfull!",
        text: "!",
        icon: "success"
      });
    } else {
      console.error('Unexpected response:', response);
      error.value = 'An unexpected error occurred after processing the payment.';
    }
  } catch (err) {
    error.value = 'An error occurred while processing your payment.';
  }
};
</script>

<style scoped>
#card-element {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  transition: box-shadow 150ms ease;
}

#card-element.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

#card-element.StripeElement--invalid {
  border-color: #fa755a;
}

#card-element.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}

button[disabled] {
  cursor: not-allowed;
  background-color: #ccc;
}

button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>
