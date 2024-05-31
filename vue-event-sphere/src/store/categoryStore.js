import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useCategoryStore = defineStore('category', () => {
    const url = 'http://localhost:5220/api/';

    async function getAllCategoryIds() {
        try {
            const response = await axios.get(`${url}EventCategory`);
            const data = response.data;
            return data.map(category => category.id);
        } catch (err) {
            console.error(err);
            return [];
        }
    }


    return { getAllCategoryIds };
});

