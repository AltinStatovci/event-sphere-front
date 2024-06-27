<script setup>

import Swal from 'sweetalert2';
import { ref, reactive, watch } from 'vue';
import { useTicketStore } from '@/store/ticketStore';
import { defineProps } from 'vue';


const ticketStore = useTicketStore();
const ticketById = ref(null);

const props = defineProps({
    ticketId: Number,
    ticketById: Object,
    eventId: Number,
});

const selectedTicket = reactive({
    id: props.ticketId,
    eventID: props.eventId,
    ticketType: '',
    price: 0,
    bookingReference: '',
});

watch(() => props.ticketId, async (newValue) => {
    if (newValue !== null) {
        ticketById.value = await ticketStore.getTicketById(newValue);
        Object.assign(selectedTicket, ticketById.value);
    }
}, { immediate: true });

const updateTicket = async () => {
    try {
        await ticketStore.updateTicket(selectedTicket);
        Swal.fire({
            title: 'Ticket Updated successfully!',
            icon: 'success'
        }).then(() => {
            location.reload();
        });
    } catch (e) {
        Swal.fire({
            title: 'Error!',
            text: e.response ? e.response.data : e.message || 'Failed to add ticket',
            icon: 'error'
        });
    }
};
</script>

<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card mb-4">
                <div class="card-header">Edit Ticket</div>
                <div class="card-body">
                    <form @submit.prevent="updateTicket">
                        <div class="row gx-3 mb-3">

                            <div class="col-md-6">
                                <label class="small mb-1" for="editTicketType">Ticket Type</label>
                                <input class="form-control" id="editTicketType" type="text"
                                    v-model.trim="selectedTicket.ticketType">
                            </div>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="editPrice">Price</label>
                                <input class="form-control" id="editPrice" type="text"
                                    v-model.trim="selectedTicket.price">
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="editBookingReference">Booking Reference</label>
                                <input class="form-control" id="editBookingReference" type="text"
                                    v-model.trim="selectedTicket.bookingReference">
                            </div>
                        </div>
                        <button class="btn btn-primary" type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.image-container {
    width: 10rem;
    height: 10rem;
    border: 1px solid #c5ccd6;
    border-radius: 0.35rem;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
</style>
