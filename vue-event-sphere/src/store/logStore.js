import { defineStore } from "pinia";
import { ref } from "vue";
import client from "@/helpers/client.js";


export const useLogStore = defineStore('log', () => {
    const url = 'http://localhost:5220/api/';

    const logs = ref([]);

    const getLogs = async (level) => {
        try {
            const response = await client.get(`${url}log/${level}`);
            logs.value = response.data;
            return logs.value;
        } catch (error) {
            console.error('Error getting logs:', error);
            throw error;
        }
    };

    const deleteLog = async (id) => {
        try {
            await client.delete(`${url}log/deleteLog/${id}`);
        } catch (error) {
            console.error(`Error deleting log with id ${id}:`, error);
            throw error;
        }
    };

    const deleteAllLogs = async () => {
        try {
            await client.delete(`${url}log/deleteLog/all`);
        } catch (error) {
            console.error('Error deleting all logs:', error);
            throw error;
        }
    };

    return { logs, getLogs, deleteLog, deleteAllLogs };
});