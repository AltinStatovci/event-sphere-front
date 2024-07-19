import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from '@/helpers/client.js';

export const useNotificationStore = defineStore('notification', () => {
    const url = 'http://localhost:5220/api/Notification/'; // Ensure this is correct

    const notifications = ref([]);
    const unreadNotifications = ref([]); // Ensure this is initialized as an empty array



    const markAsRead = async (notificationId) => {
        try {
            const response = await client.post(`${url}mark-as-read/${notificationId}`);
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error.response?.data || error.message);
            throw error;
        }
    };

    const getUnreadNotifications = async (userId) => {
        try {
            const response = await client.get(`${url}unread/${userId}`);
            unreadNotifications.value = response.data;
            return unreadNotifications.value;
        } catch (error) {
            console.error('Error getting unread notifications:', error.response?.data || error.message);
            throw error;
        }
    };

    return {markAsRead, getUnreadNotifications, notifications, unreadNotifications };
});
