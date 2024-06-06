<script setup>
import { ref, onMounted } from 'vue';
import SideBar from "@/components/SideBar.vue";

const payments = ref([]);

const fetchPayments = async () => {
    try {
        const response = await fetch('http://localhost:5220/api/Payment');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error('Empty response or invalid JSON format');
        }
        payments.value = data;
        console.log('Fetched payments:', payments.value);
    } catch (error) {
        console.error('Error fetching payments:', error);
    }
};

// Fetch payments on component mount
onMounted(() => {
    fetchPayments();
});

// Placeholder edit and delete functions
const editPayment = (id) => {
    console.log('Edit payment:', id);
    // Implement edit logic here
};

const deletePayment = (id) => {
    console.log('Delete payment:', id);
    // Implement delete logic here
};
</script>

<template>

<div class="d-flex">
  <side-bar/>
    <div class="dashboard">
        <div class="content">
            <span class="material-icons" style="font-size: 4rem; color: gray;">wallet</span>
            <h1>Payments</h1>

            <div class="table-container">
                <table class="payment-table">
                    <thead>
                        <tr>
                            <th class="id-col">ID</th>
                            <th class="user-id-col">User ID</th>
                            <th class="event-id-col">Event ID</th>
                            <th class="ticket-id-col">Ticket ID</th>
                            <th class="amount-col">Amount</th>
                            <th class="payment-method-col">Payment Method</th>
                            <th class="payment-status-col">Payment Status</th>
                            <th class="payment-date-col">Payment Date</th>
                            <th class="action-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="payment in payments" :key="payment.id">
                            <td>{{ payment.id }}</td>
                            <td>{{ payment.user ? payment.user.id : 'N/A' }}</td>
                            <td>{{ payment.event ? payment.event.id : 'N/A' }}</td>
                            <td>{{ payment.ticket ? payment.ticket.id : 'N/A' }}</td>
                            <td>{{ payment.amount }}</td>
                            <td>{{ payment.paymentMethod }}</td>
                            <td>{{ payment.paymentStatus }}</td>
                            <td>{{ payment.paymentDate }}</td>
                            <td>
                                <button class="action-btn edit-btn" @click="editPayment(payment.id)">Edit</button>
                                <button class="action-btn delete-btn" @click="deletePayment(payment.id)">Delete</button>
                            </td>
                        </tr>
                        <tr v-if="payments.length === 0">
                            <td colspan="9" class="no-data">No payments available</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.dashboard {
    display: flex;
    background-color: #3fa387;
    height: 100vh;
    width: 100%;
}

.content {
    flex: 1;
    padding: 20px;
    margin-left: 20px;
    margin-top: 40px;
    margin-right: 40px;
    margin-bottom: 150px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
}

.table-container {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.payment-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 8px;
}

.payment-table th,
.payment-table td {
    border: 1px solid #e0e0e0;
    padding: 14px 20px;
    text-align: left;
}

.payment-table th {
    background-color: #212121;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    position: sticky;
    top: 0;
    z-index: 1;
}

.payment-table td {
    color: #333;
    font-size: 16px;
}

.payment-table tbody tr:nth-child(even) {
    background-color: #f5f5f5;
}

.payment-table tbody tr:hover {
    background-color: #ececec;
}

.action-btn {
    padding: 8px 16px;
    margin-right: 6px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    outline: none;
}

.edit-btn {
    background-color: #4CAF50;
    color: white;
}

.delete-btn {
    background-color: #f44336;
    color: white;
}

.no-data {
    text-align: center;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    color: #999;
}
</style>
