import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import client from "../helpers/client";

export const usePromoCodeStore = defineStore('promoCode', () => {
    const url = 'http://localhost:5220/api/';
    const promoCodes = ref([]);
    const promoCode = ref(null);

    async function fetchPromoCodes() {
        try {
            const response = await client.get(`${url}PromoCode`);
            promoCodes.value = response.data;
        } catch (err) {
            console.error("Error fetching promo codes: ", err);
        }
    }

    async function fetchPromoCodeById(id) {
        try {
            const response = await client.get(`${url}PromoCode/${id}`);
            promoCode.value = response.data;
        } catch (err) {
            console.error("Error fetching promo code: ", err);
        }
    }

    async function createPromoCode(newPromoCode) {
        try {
            await client.post(`${url}PromoCode`, newPromoCode);
            fetchPromoCodes();
        } catch (err) {
            console.error("Error creating promo code: ", err);
        }
    }

    async function updatePromoCode(id, updatedPromoCode) {
        try {
            await client.put(`${url}PromoCode/${id}`, updatedPromoCode);
            fetchPromoCodes();
        } catch (err) {
            console.error("Error updating promo code: ", err);
        }
    }

    async function deletePromoCode(id) {
        try {
            await client.delete(`${url}PromoCode/${id}`);
            fetchPromoCodes();
        } catch (err) {
            console.error("Error deleting promo code: ", err);
        }
    }

    return { promoCodes, promoCode, fetchPromoCodes, fetchPromoCodeById, createPromoCode, updatePromoCode, deletePromoCode };
});
