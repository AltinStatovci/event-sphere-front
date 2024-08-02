import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from "@/helpers/client.js"; // Assuming you have configured axios client here

export const useReviewStore = defineStore('review', () => {
    const url = 'http://localhost:5220/api/';
    const reviews = ref([]);
    const review = ref(null);

    async function fetchReviews() {
        try {
            const response = await client.get(`${url}Review`);
            reviews.value = response.data;
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    }

    async function getReviewById(id) {
        try {
            const response = await client.get(`${url}Review/${id}`);
            review.value = response.data;
            return review.value;
        } catch (err) {
            console.error("Error fetching review:", err);
            return null;
        }
    }
    async function getOrganizerById(id) { // Add this function to fetch organizer details
        try {
            const response = await client.get(`${url}Organizer/${id}`);
            organizer.value = response.data;
            return organizer.value;
        } catch (err) {
            console.error("Error fetching organizer:", err);
            return null;
        }
    }
    async function submitReview(reviewData) {
        try {
            console.log("Submitting review with data:", reviewData); // Debug: inspect the payload
            const response = await client.post(`${url}Review`, reviewData);
            await fetchReviews(); // Refresh the reviews list
            return response.data;
        } catch (err) {
            console.error("Error submitting review:", err);
            throw err;
        }
        
    }

    async function updateReview(reviewId, reviewData) {
        try {
            const response = await client.put(`${url}Review/${reviewId}`, reviewData);
            await fetchReviews(); // Refresh the reviews list
            return response.data;
        } catch (err) {
            console.error("Error updating review:", err);
        }
    }

    async function deleteReview(id) {
        try {
            await client.delete(`${url}Review/${id}`);
            await fetchReviews(); // Refresh the reviews list
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }

    return { reviews, review, fetchReviews, getReviewById, submitReview, updateReview, deleteReview, getOrganizerById, };
});
