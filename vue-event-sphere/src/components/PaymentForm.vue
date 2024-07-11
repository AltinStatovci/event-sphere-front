<template>
  <div class="container">
    <h1 class="h3 mb-5">Payment</h1>
    <div class="row">
      <!-- Left -->
      <div class="col-lg-9">
        <div class="accordion" id="accordionPayment">
          <!-- Credit card -->
          <div class="accordion-item mb-3">
            <h2 class="h5 px-4 py-3 accordion-header d-flex justify-content-between align-items-center">
              <div class="form-check w-100 collapsed" data-bs-toggle="collapse" data-bs-target="#collapseCC" aria-expanded="false">
                <input class="form-check-input" type="radio" name="payment" id="payment1" v-model="selectedPaymentMethod" value="creditCard">
                <label class="form-check-label pt-1" for="payment1">
                  Credit Card
                </label>
              </div>
              <span>
                <!-- SVG for Credit Card Icon -->
              </span>
            </h2>
            <div id="collapseCC" class="accordion-collapse collapse" :class="{ show: selectedPaymentMethod === 'creditCard' }" data-bs-parent="#accordionPayment">
              <div class="accordion-body">
                <div class="mb-3">
                  <label class="form-label" for="card-number">Card Number</label>
                  <div id="card-element" class="card-element"></div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Name on card</label>
                  <input type="text" class="form-control" v-model="creditCard.name">
                </div>
                <div class="row">
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Expiry date</label>
                      <div id="card-expiry" class="card-element"></div>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">CVV Code</label>
                      <div id="card-cvc" class="card-element"></div>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Zip Code</label>
                      <input type="text" class="form-control" v-model="creditCard.zipCode">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Right -->
      <div class="col-lg-3">
        <div class="card position-sticky top-0">
          <div class="p-3 bg-light bg-opacity-10">
            <h6 class="card-title mb-3">Payment Summary</h6>
            <div class="d-flex justify-content-between mb-1 small">
              <span>Subtotal</span> <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="form-group">
              <label for="promo-code">Promo Code</label>
              <input type="text" id="promo-code" v-model="promoCode" />
              <button type="button" @click="validatePromoCode">Apply Promo Code</button>
            </div>
            <div v-if="promoCode && discount > 0" class="discount-card">
             
              <p>Discount Applied: {{ discount }}%</p>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-4 small">
              <span>TOTAL</span> <strong class="text-dark">{{ formatCurrency(total) }}</strong>
            </div>
            <button class="btn btn-primary w-100 mt-2" type="button" @click="submitPayment" :disabled="loading">
              Pay
            </button>
            <div v-if="error" class="error-message">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useAuthStore } from "@/store/authStore.js";
import { useTicketStore } from "@/store/ticketStore.js";
import { usePaymentStore } from '@/store/paymentStore';
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';

const selectedPaymentMethod = ref('creditCard');
const creditCard = ref({
  name: '',
  expiry: '',
  cvc: '',
  zipCode: ''
});
const promoCode = ref('');
const stripe = ref(null);
const cardNumberElement = ref(null);
const cardExpiryElement = ref(null);
const cardCvcElement = ref(null);
const loading = ref(false);
const error = ref(null);
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const paymentStore = usePaymentStore();
const ticket = ref(null);
const router = useRouter();
const discount = ref(0);

const path = window.location.pathname;
const segments = path.split('/');
const id = segments[segments.length - 1];

const originalAmount = computed(() => {
  if (ticket.value && paymentStore.amount) {
    return paymentStore.amount * ticket.value.price;
  }
  return 0;
});

const discountedAmount = computed(() => {
  return originalAmount.value * (1 - discount.value / 100);
});

const subtotal = computed(() => {
  return originalAmount.value;
});

const total = computed(() => {
  return discountedAmount.value;
});

onMounted(async () => {
  try {
    ticket.value = await ticketStore.getTicketById(id);
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

    cardNumberElement.value = elements.create('cardNumber', { style });
    cardNumberElement.value.mount('#card-element');

    cardExpiryElement.value = elements.create('cardExpiry', { style });
    cardExpiryElement.value.mount('#card-expiry');

    cardCvcElement.value = elements.create('cardCvc', { style });
    cardCvcElement.value.mount('#card-cvc');
  } catch (stripeError) {
    console.error('Stripe initialization error:', stripeError);
    error.value = 'Failed to initialize payment form.';
  }
});

const validatePromoCode = async () => {
  try {
    const response = await axios.post('http://localhost:5220/api/payment/validatePromoCode', { code: promoCode.value });
    discount.value = response.data.discount;
    error.value = null;
    Swal.fire({
      title: "Promo Code Applied!",
      text: `You got a ${discount.value}% discount!`,
      icon: "success",
      confirmButtonText: "OK"
    });
  } catch (err) {
    discount.value = 0;
    error.value = err.response?.data || 'Invalid or expired promo code.';
    Swal.fire({
      title: "Invalid Promo Code",
      text: "The promo code you entered is invalid or expired.",
      icon: "error",
      confirmButtonText: "OK"
    });
  }
};

const submitPayment = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { token, error: stripeError } = await stripe.value.createToken(cardNumberElement.value, {
      name: creditCard.value.name,
      address_zip: creditCard.value.zipCode
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
    const originalAmount = paymentStore.amount * ticket.value.price;
    const discountedAmount = originalAmount * (1 - discount.value / 100);
    
    const response = await axios.post('http://localhost:5220/api/Payment', {
      userID: authStore.id,
      ticketID: ticket.value.id,
      amount: paymentStore.amount,
      price: discountedAmount,
      paymentMethod: 'Stripe',
      paymentDate: new Date().toISOString(),
      stripeToken: stripeToken,
      paymentStatus: true,
      promoCode: promoCode.value
    });

    if (response.status === 204 || response.status === 201 || response.status === 200) {
      await Swal.fire({
        title: "Payment successful!",
        text: "Thank you for your purchase!",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        router.push({ name: 'home' });
      });
    } else {
      console.error('Unexpected response:', response);
      error.value = 'An unexpected error occurred after processing the payment.';
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message === 'There are not enough tickets available') {
      await Swal.fire({
        title: "Purchase failed",
        text: "There are not enough tickets available.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } else {
      error.value = 'An error occurred while processing your payment.';
    }
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
</script>

<style scoped>
.payment-form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.payment-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.card-element {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  transition: box-shadow 150ms ease;
}

.card-element.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.card-element.StripeElement--invalid {
  border-color: #fa755a;
}

.card-element.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
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

button[disabled] {
  cursor: not-allowed;
  background-color: #ccc;
}

.error-message {
  color: #ff3860;
  margin-top: 10px;
}
</style>
