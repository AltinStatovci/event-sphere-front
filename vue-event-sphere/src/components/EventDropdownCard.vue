<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    event: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['view-details']);

const viewDetails = () => {
    emit('view-details', props.event.id);
};
</script>


<template>
    <div class="event-card">
        <h3>{{ event.eventName }}</h3>
        <p>{{ event.eventDescription }}</p>
        <p>Date: {{ event.eventDate }}</p>
        <button @click="viewDetails">View Details</button>
    </div>
</template>


<style>
.event-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
}
</style>