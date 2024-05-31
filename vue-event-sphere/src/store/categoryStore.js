import { defineStore } from 'pinia';
import axios from 'axios';

export const useCategoryStore = defineStore('category', () => {
    const url = 'http://localhost:5220/api/';

    async function getAllCategories() {
        try {
            const response = await axios.get(`${url}EventCategory`);
            const data = response.data;
            return data.map(category => ({
                id: category.id,
                categoryName: category.categoryName
            }));
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    return { getAllCategories };
});
