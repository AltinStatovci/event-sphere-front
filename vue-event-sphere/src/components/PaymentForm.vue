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
import { useAuthStore } from "@/store/authStore.js";


const cardHolderName = ref('');
const stripe = ref(null);
const cardElement = ref(null);
const loading = ref(false);
const error = ref(null);
const authStore = useAuthStore();

onMounted(async () => {
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
    const response = await fetch('http://localhost:5220/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: authStore.id,  
        ticketID: 1,  
        amount: 100,  
        paymentMethod: 'Stripe',
        paymentDate: new Date().toISOString(),
        stripeToken: stripeToken,
        paymentStatus: true
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert('Payment successful!');
    } else {
      error.value = result.message || 'Payment failed.';
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
