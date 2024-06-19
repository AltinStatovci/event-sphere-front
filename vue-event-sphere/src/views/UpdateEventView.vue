<script setup>
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';
import { ref, reactive, watch, onMounted } from 'vue';
import { useEventStore } from '@/store/eventStore';
import { useCategoryStore } from '@/store/categoryStore'; // Import category store

const imageUrl = ref('https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg');
const authStore = useAuthStore();
const eventStore = useEventStore();
const categoryStore = useCategoryStore(); // Initialize category store

const props = defineProps({
    eventId: Number,
    eventById: Object,
});

const selectedEvent = reactive({
    id: null,
    eventName: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    categoryId: null,
    organizerId: authStore.id,
    maxAttendees: 0,
    availableTickets: 0,
    dateCreated: new Date().toISOString(),
    image: '',
    newImage: '',
});

watch(() => props.eventById, (newValue) => {
    if (newValue) {
        selectedEvent.id = newValue.id;
        selectedEvent.eventName = newValue.eventName;
        selectedEvent.description = newValue.description;
        selectedEvent.startDate = newValue.startDate;
        selectedEvent.endDate = newValue.endDate;
        selectedEvent.location = newValue.location;
        selectedEvent.category = newValue.category;
        selectedEvent.maxAttendees = newValue.maxAttendees;
        selectedEvent.availableTickets = newValue.availableTickets;
        selectedEvent.image = newValue.image;
        imageUrl.value = newValue.image;
    }
}, { immediate: true });

const handleEditImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedEvent.newImage = file;
        imageUrl.value = URL.createObjectURL(file);
    }
};

const updateEvent = async () => {
    try {
        await eventStore.updateEvent(selectedEvent);
        await Swal.fire({
            title: "Event updated successfully!",
            icon: "success"
        }).then(() => {
            location.reload();
        });
    } catch (e) {
        await Swal.fire({
            title: "Error!",
            text: e.message,
            icon: "error"
        });
    }
};

const categories = ref([]);

// Fetch categories on component mount
onMounted(async () => {
    categories.value = await categoryStore.getAllCategories();
});
</script>


<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card mb-4">
                <div class="card-header">Edit Event</div>
                <div class="card-body">
                    <form @submit.prevent="updateEvent">
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="editEventName">Event Name</label>
                                <input class="form-control" id="editEventName" type="text"
                                    v-model.trim="selectedEvent.eventName">
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="editDescription">Description</label>
                                <input class="form-control" id="editDescription" type="text"
                                    v-model.trim="selectedEvent.description">
                            </div>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="editLocation">Location</label>
                                <select class="form-control" id="editLocation" v-model.trim="selectedEvent.location">
                                    <option value="" disabled selected>Select a location</option>
                                    <option value="Kosovë, Prishtinë">Kosovë, Prishtinë</option>
                                    <option value="Kosovë, Pejë">Kosovë, Pejë</option>
                                    <option value="Kosovë, Mitrovicë">Kosovë, Mitrovicë</option>
                                    <option value="Kosovë, Vushtrri">Kosovë, Vushtrri</option>
                                    <option value="Kosovë, Suharekë">Kosovë, Suharekë</option>
                                    <option value="Kosovë, Rahovec">Kosovë, Rahovec</option>
                                    <option value="Kosovë, Istog">Kosovë, Istog</option>
                                    <option value="Kosovë, Deçan">Kosovë, Deçan</option>
                                    <option value="Kosovë, Malishevë">Kosovë, Malishevë</option>
                                    <option value="Kosovë, Shtime">Kosovë, Shtime</option>
                                    <option value="Kosovë, Kaçanik">Kosovë, Kaçanik</option>
                                    <option value="Kosovë, Kamenicë">Kosovë, Kamenicë</option>
                                    <option value="Kosovë, Fushë Kosovë">Kosovë, Fushë Kosovë</option>
                                    <option value="Kosovë, Obiliq">Kosovë, Obiliq</option>
                                    <option value="Kosovë, Skenderaj">Kosovë, Skenderaj</option>
                                    <option value="Kosovë, Klinë">Kosovë, Klinë</option>
                                    <option value="Kosovë, Hani i Elezit">Kosovë, Hani i Elezit</option>
                                    <option value="Kosovë, Junik">Kosovë, Junik</option>
                                    <option value="Kosovë, Mamusha">Kosovë, Mamushë</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="editCategoryId">Category</label>
                                <select class="form-control" id="editCategoryId" v-model="selectedEvent.categoryId">
                                    <option :value="null" disabled>Select a category</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                        {{ category.categoryName }}
                                    </option>
                                </select>
                            </div>

                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="editStartDate">Start Date</label>
                                <input class="form-control" id="editStartDate" type="datetime-local"
                                    v-model="selectedEvent.startDate">
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="editEndDate">End Date</label>
                                <input class="form-control" id="editEndDate" type="datetime-local"
                                    v-model="selectedEvent.endDate">
                            </div>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="editMaxAttendees">Max Attendees</label>
                                <input class="form-control" id="editMaxAttendees" type="number"
                                    v-model="selectedEvent.maxAttendees">
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="editAvailableTickets">Available Tickets</label>
                                <input class="form-control" id="editAvailableTickets" type="number"
                                    v-model="selectedEvent.availableTickets">
                            </div>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-12">
                                <div class="card mb-4 mb-xl-0">
                                    <div class="card-header">Event Image</div>
                                    <div class="card-body text-center">
                                        <div class="image-container" :style="{ backgroundImage: `url(${imageUrl})` }">
                                            <div v-if="!imageUrl" class="placeholder">No Image Selected</div>
                                        </div>
                                        <div class="small font-italic text-muted mb-4">Upload your Event Image</div>
                                        <input class="form-control" id="editFile" type="file" ref="editFileInput"
                                            @change="handleEditImageUpload" style="display: none;">
                                        <button class="btn btn-warning" type="button"
                                            @click="$refs.editFileInput.click()">Upload new image</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-warning" type="submit">Update</button>
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
    /* changed from 50% to 0.35rem for square shape */
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
</style>
