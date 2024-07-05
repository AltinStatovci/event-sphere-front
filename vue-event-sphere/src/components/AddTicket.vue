<script setup>
import { useTicketStore } from "@/store/ticketStore";
import Swal from "sweetalert2";
import { reactive } from "vue";

const ticketStore = useTicketStore();

const props = defineProps({
    eventID: Number,
});

const formData = reactive({
    eventID: props.eventID,
    ticketType: '',
    ticketAmount: 0,
    price: 0,
    bookingReference: '',
});

const handleSubmit = async () => {
    try {
        console.log(formData);
        await ticketStore.addTicket(formData);
        Swal.fire({
            title: 'Ticket Added successfully!',
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
}
</script>

<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card mb-4">
                <div class="card-header">Ticket Details</div>
                <div class="card-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="ticketType">Ticket Type</label>
                                <input class="form-control" id="ticketType" type="text" placeholder="Enter ticket type"
                                    v-model.trim="formData.ticketType">
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="price">Price</label>
                                <input class="form-control" id="price" type="number" placeholder="Enter amount"
                                    v-model.trim="formData.ticketAmount">
                            </div>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="price">Price</label>
                                <input class="form-control" id="price" type="number" placeholder="Enter price"
                                    v-model.trim="formData.price">
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="bookingReference">Booking Reference</label>
                                <input class="form-control" id="bookingReference" type="text"
                                    placeholder="Enter booking reference" v-model.trim="formData.bookingReference">
                            </div>
                        </div>
                        <button class="btn btn-primary" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
