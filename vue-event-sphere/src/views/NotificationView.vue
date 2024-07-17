<template>
  <div>
    <h1>Notification</h1>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import connection from '@/signalR/useSignalR.js';

connection.on("ReceiveNotification", (message) => {
  toast.success(message, {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: true,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
  });
});


</script>


<style scoped>
div{
  height: 55vh;
}
</style>