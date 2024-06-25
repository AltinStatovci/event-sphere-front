import { defineStore } from "pinia";
import { ref, toRaw } from "vue";
import client from "@/helpers/client.js";
import { useAuthStore } from "@/store/authStore.js";

export const useUserStore = defineStore('user', () => {
    const authStore = useAuthStore();
    const url = 'http://localhost:5220/api/';

    const user = ref(null);
    const users = ref([]);
    const userCount = ref(0);
    const roles = ref([]);


    const getRoles = async () =>{
        try {
            const response = await client.get(`${url}roles`)
            roles.value = response.data;
            return roles.value
        }catch (error){
            console.error('Error getting roles:', error);
            throw error
        }
    }

    const getUsers = async () => {
        try {
            const response = await client.get(`${url}User/getUsers`);
            users.value = response.data; // Ensure plain object
            return users.value;
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    };

    const getUserCount = async () => {
        try {
            const response = await client.get(`${url}User/count`);
            userCount.value = response.data; // Ensure plain object
            return userCount.value;
        } catch (error) {
            console.error('Error getting user count:', error);
            throw error;
        }
    };

    const getUser = async (id) => {
        try {
            const response = await client.get(`${url}User/getUser/${id}`);
            user.value = response.data; // Ensure plain object
            return user.value;
        } catch (error) {
            console.error(`Error getting user with id ${id}:`, error);
            throw error;
        }
    };

    const updateUser = async (userUpdate) => {
        try {
            await client.put(`${url}User/updateUser`, userUpdate);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const updateUserPassword = async (id, updatePasswordDto) => {
        try {
            await client.patch(`${url}User/updateUserPassword/${id}`, updatePasswordDto);
        } catch (error) {
            console.error(`Error updating user password for id ${id}:`, error);
            throw error;
        }
    };


    const deleteUser = async (id) => {
        try {
            await client.delete(`${url}User/deleteUser/${id}`);
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            throw error;
        }
    };

    return { getUsers, getUserCount, getUser, updateUser, deleteUser, getRoles,updateUserPassword ,user, users, userCount, roles };
});
