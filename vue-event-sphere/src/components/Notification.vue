<template>
    <div class="notification-container">
        <div v-if="showNotifications" class="notification-chat">
            <div class="card" id="notifications">
                <div class="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                    <h3>Notification</h3>
                    <a class="ms-3 link-info"><i class="fas fa-paper-plane"></i></a>
                </div>
                <hr>
                <div class="card-body" data-mdb-perfect-scrollbar-init style="position: relative; height: 400px">
                    <!-- Example notifications -->

                    <div class="d-flex flex-row justify-content-start mb-4">

                        <div>
                            <p class="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">Notification 1: New event near
                                you.</p>
                        </div>
                    </div>
                    <div class="d-flex flex-row justify-content-end mb-4">
                        <div>
                            <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-info">Notification 2: Your profile was
                                updated successfully.</p>
                        </div>

                    </div>
                    <!-- Add more notifications as needed -->
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const showNotifications = ref(false);

function toggleNotifications() {
    showNotifications.value = !showNotifications.value;
}

defineExpose({
    toggleNotifications,
});
</script>

<style scoped>
.notification-container {
    position: relative;
}

.notification-chat {
    position: absolute;
    top: 25px;
    right: 0;
    width: 350px;
    z-index: 1000;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-body {
    overflow-y: auto;
}

.small {
    font-size: 0.875rem;
}

.bg-body-tertiary {
    background-color: #f8f9fa;
}

.bg-info {
    background-color: #17a2b8;
}

.text-muted {
    color: #6c757d;
}

.rounded-3 {
    border-radius: 0.75rem;
}

.ms-3 {
    margin-left: 1rem;
}

.me-3 {
    margin-right: 1rem;
}

.mb-1 {
    margin-bottom: 0.25rem;
}

.mb-3 {
    margin-bottom: 1rem;
}

.notification-avatar {
    width: 45px;
    height: 100%;
}

.notification-avatar-small {
    width: 40px;
    height: 100%;
}
</style>
