<script setup>
import { ref, defineExpose, onMounted, computed } from 'vue';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from "@/store/authStore.js";

const authStore = useAuthStore();
const showNotifications = ref(false);
const notificationStore = useNotificationStore();

async function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    await notificationStore.getUnreadNotifications(authStore.id);
  }
}

const formatPaymentDateTime = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
  return `${formattedDate} - ${formattedTime}`;
};

async function markNotificationAsRead(notificationId) {
  await notificationStore.markAsRead(notificationId);
  const index = notificationStore.unreadNotifications.findIndex(notification => notification.id === notificationId);
  if (index !== -1) {
    notificationStore.unreadNotifications.splice(index, 1);
  }
}

async function markAllNotificationsAsRead() {
  await notificationStore.markAllAsRead(authStore.id);
  notificationStore.unreadNotifications = [];
}

const hasUnreadNotifications = computed(() => {
  return notificationStore.unreadNotifications.length > 0;
});

defineExpose({
  toggleNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
});
</script>


<template>
  <div class="notification-container">
    <div v-if="showNotifications" class="notification-chat">
      <div class="card" id="notifications">
        <div class="card-footer text-muted d-flex justify-content-between align-items-center p-3">
          <h3>Notification</h3>
          <p class="mt-2 link-info" @click="markAllNotificationsAsRead"><i class="fas fa-check-double"></i> Mark All as Read</p>
        </div>
        <hr>
        <div class="card-body" data-mdb-perfect-scrollbar-init style="position: relative; height: 400px">
          <transition-group name="notification" tag="div">
            <template v-if="notificationStore.unreadNotifications.length > 0">
              <div v-for="notification in notificationStore.unreadNotifications" :key="notification.id" class="d-flex flex-row mb-4 align-items-center" @click="markNotificationAsRead(notification.id)">
                <div class="flex-grow-1">
                  <p class="small p-3 mb-1 text-white rounded-3 bg-info">{{ notification.message }} on  {{ formatPaymentDateTime(notification.createdAt) }}</p>
                </div>
                <i class="bi bi-check-lg ms-3" style="color: #17a2b8; font-size: 1.5rem; cursor: pointer;" @click="markNotificationAsRead(notification.id)"></i>
              </div>
            </template>
            <template v-else>
              <p class="text-muted">No new notifications</p>
            </template>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

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

.mb-1 {
  margin-bottom: 0.25rem;
}

.flex-grow-1 {
  flex-grow: 1;
}


.notification-enter-active, .notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from, .notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>