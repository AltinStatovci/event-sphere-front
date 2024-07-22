import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from '@/helpers/client.js';

export const useNotificationStore = defineStore('notification', () => {
    const url = 'http://localhost:5220/api/Notification/'; // Ensure this is correct

    const notifications = ref([]);
    const unreadNotifications = ref([]);

    const markAsRead = async (notificationId) => {
        try {
            const response = await client.post(`${url}markAsRead/${notificationId}`);
            // Remove the notification from the unreadNotifications array after marking it as read
            unreadNotifications.value = unreadNotifications.value.filter(notification => notification.id !== notificationId);
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error.response?.data || error.message);
            throw error;
        }
    };

    const markAllAsRead = async (userId) => {
        try {
            const response = await client.post(`${url}markAllAsRead/${userId}`);
            // Clear the unreadNotifications array after marking all as read
            unreadNotifications.value = [];
            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error.response?.data || error.message);
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

    return { markAsRead, markAllAsRead, getUnreadNotifications, notifications, unreadNotifications };
});