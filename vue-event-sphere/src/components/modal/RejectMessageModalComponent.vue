<script setup>
import { ref } from 'vue';
import { useEventStore } from '@/store/eventStore';
import Swal from 'sweetalert2';


const props = defineProps({
  rejectModal: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

const message = ref('');
const isSubmitting = ref(false);

const eventStore = useEventStore();

const updateResponse = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    await eventStore.rejectEvent(props.rejectModal.eventId, message.value);
    await Swal.fire({
      title: "Email sent successfully!",
      text: '',
      icon: "success"
    });
    emit('close');
    isSubmitting.value = false;
  } catch (error) {
    console.error('Error rejecting the event', error);
  }
};
</script>

<template>
  <div v-if="props.rejectModal.visible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h5>Response</h5>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="updateResponse">
          <textarea v-model="message" rows="5" class="form-control"
            placeholder="Type in your reason for rejection"></textarea>
          <button type="submit" class="btn btn-outline-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Save changes</span></button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
}
.btn {
  text-transform: capitalize;
}
</style>
