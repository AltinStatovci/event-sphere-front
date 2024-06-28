<script setup>
import UpdateTicketView from '@/views/UpdateTicketView.vue';
import AddTicket from '@/components/AddTicket.vue';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useTicketStore } from '@/store/ticketStore';

const ticketStore = useTicketStore();

const props = defineProps({
    tickets: Array,
    eventID: Number,  // Ensure eventId is received as a prop
});

const activeTab = ref('ticketList');
const selectedTicketId = ref(null);


const deleteTicket = async (ticketId) => {
    try {
        await ticketStore.deleteTicket(ticketId);
        Swal.fire({
            title: "Ticket Deleted successfully!",
            icon: "success"
        }).then(() => {
            location.reload();
        });
    } catch (err) {
        await Swal.fire({
            title: "Error!",
            text: err.response ? err.response.data : err.message,
            icon: "error"
        });
    }
}

const openEditForm = (ticketId) => {
    selectedTicketId.value = ticketId;
    activeTab.value = 'ticketForm';
};

const changeTab = (tab) => {
    activeTab.value = tab;
    if (tab === 'ticketList') {
        selectedTicketId.value = null;
    }
};
</script>

<template>
    <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'ticketList' }" @click.prevent="changeTab('ticketList')">Ticket List</a>
        <a class="nav-link" :class="{ active: activeTab === 'ticketForm' }" @click.prevent="changeTab('ticketForm')">Ticket Form</a>
    </nav>
    <hr class="mt-0 mb-4">
    <div v-if="activeTab === 'ticketList'" class="card mt-4">
        <div class="card-header">Ticket List</div>
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Event Name</th>
                        <th scope="col">Ticket Type</th>
                        <th scope="col">Price</th>
                        <th scope="col">Booking Reference</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ticket in tickets" :key="ticket.id">
                        <td>{{ ticket.eventName }}</td>
                        <td>{{ ticket.ticketType }}</td>
                        <td>{{ ticket.price }} €</td>
                        <td>{{ ticket.bookingReference }}</td>
                        <td>
                            <button class="btn btn-outline-danger btn-sm"
                                @click="deleteTicket(ticket.id)">Delete</button>
                            <button class="btn btn-outline-primary btn-sm"
                                @click="openEditForm(ticket.id)">Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="activeTab === 'ticketForm'" class="mt-3">
        <UpdateTicketView v-if="selectedTicketId" :ticketId="selectedTicketId"/>
        <AddTicket v-else :eventID="props.eventID"/>
    </div>
</template>

<style scoped>
.nav-borders .nav-link.active {
    color: #0061f2;
    border-bottom-color: #0061f2;
}

.nav-borders .nav-link {
    color: #69707a;
    border-bottom-width: 0.125rem;
    border-bottom-style: solid;
    border-bottom-color: transparent;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0;
    padding-right: 0;
    margin-left: 1rem;
    margin-right: 1rem;
    cursor: pointer;
}
.btn{
    text-transform: none;
}
</style>
