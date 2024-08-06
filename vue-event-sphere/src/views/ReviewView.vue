<script>
import { useReviewStore } from '@/store/reviewStore';
import { useAuthStore } from '@/store/authStore';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import StarRating from '@/components/StarRating.vue';

export default {
  components: {
    StarRating,
  },
  setup() {
    const reviewStore = useReviewStore();
    const authStore = useAuthStore();
    const route = useRoute();
    const organizerID = route.params.organizerID ? parseInt(route.params.organizerID) : null;
    const isLoading = ref(true);

    const newReview = ref({
      reviewerId: '',
      organizerId: organizerID || '',
      rating: 0,
      reviewText: '',
    });

    const notification = ref({
      message: '',
      type: '', // 'success' or 'error'
    });

    onMounted(async () => {
      newReview.value.reviewerId = authStore.id;
      await loadReviews();
      isLoading.value = false;
    });

    const loadReviews = async () => {
      try {
        await reviewStore.fetchReviews();
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const addReview = async () => {
      try {
        if (organizerID) {
          newReview.value.organizerId = organizerID;
        }
        await reviewStore.submitReview(newReview.value);
        newReview.value.rating = 0;
        newReview.value.reviewText = '';
        notification.value = {
          message: 'Review added successfully!',
          type: 'success',
        };
        setTimeout(() => {
          notification.value.message = '';
        }, 3000);
        // Refresh the page to get updated reviews and average rating
        location.reload();
      } catch (error) {
        console.error('Error adding review:', error);
        notification.value = {
          message: 'Error adding review. Please try again.',
          type: 'error',
        };
        setTimeout(() => {
          notification.value.message = '';
        }, 3000);
      }
    };

    const deleteReview = async (id) => {
      try {
        await reviewStore.deleteReview(id);
        await loadReviews(); // Reload reviews to update the average rating
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    };

    const filteredReviews = computed(() => {
      return reviewStore.reviews.filter((review) => review.organizerId === organizerID);
    });

    const averageRating = computed(() => {
      if (!filteredReviews.value.length) return 0;
      const total = filteredReviews.value.reduce((acc, review) => acc + review.rating, 0);
      return (total / filteredReviews.value.length).toFixed(1); // Keep one decimal place
    });

    const formatTimeAndDate = (timestamp) => {
      const dt = new Date(timestamp);

      const month = dt.toLocaleString('default', { month: 'long' });
      const day = dt.getDate();
      const year = dt.getFullYear();
      let hours = dt.getHours();
      let minutes = dt.getMinutes();
      let seconds = dt.getSeconds();

      const am_pm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight (0 hours)

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      const formattedTimeAndDate = `${month} ${day}, ${year} ${hours}:${minutes} ${am_pm}`;

      return formattedTimeAndDate;
    };

    return {
      newReview,
      addReview,
      deleteReview,
      filteredReviews,
      averageRating,
      organizerID,
      formatTimeAndDate,
      notification,
      isLoading,
    };
  },
};
</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">
      Reviews on {{ filteredReviews.length ? filteredReviews[0].organizerName : 'Loading...' }}
    </h2>
    <ul class="list-group mb-4">
      <li
        v-for="review in filteredReviews"
        :key="review.id"
        class="list-group-item review-card d-flex justify-content-between align-items-center"
      >
        <div>
          <h3 class="mb-1">{{ review.reviewText }}</h3>
          <star-rating :rating="review.rating" :readonly="true" class="non-clickable"></star-rating>
          <small>Reviewer: {{ review.reviewerName }}</small><br />
          <small>{{ formatTimeAndDate(review.createdAt) }}</small>
        </div>
      </li>
    </ul>

    <div class="text-center mb-4" v-if="!isLoading">
      <p>
        Average Rating:
        <star-rating :rating="averageRating" :maxStars="5" :readonly="true" class="average-rating"></star-rating>
      </p>
    </div>

    <h2 class="text-center mb-4">Add a New Review</h2>
    <form @submit.prevent="addReview" class="needs-validation mb-4" novalidate>
      <input v-model="newReview.reviewerId" type="hidden" />
      <input v-model="newReview.organizerId" type="hidden" />
      <div class="mb-3">
        <label for="rating" class="form-label">Rating:</label>
        <star-rating v-model:rating="newReview.rating"></star-rating>
      </div>
      <div class="mb-3">
        <label for="reviewText" class="form-label">Review Text:</label>
        <textarea
          v-model="newReview.reviewText"
          class="form-control"
          id="reviewText"
          rows="3"
          required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

    <div v-if="notification.message" :class="['alert', notification.type === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
      {{ notification.message }}
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}

.review-card {
  background-color: white	;
}

.btn-danger {
  margin-left: 1rem;
}

.star-rating .star {
  font-size: 1.5rem;
  color: #ffd700;
}

.star {
  position: relative;
}

.non-clickable {
  pointer-events: none;
}

.average-rating {
  pointer-events: none;
}

.alert {
  margin-top: 1rem;
}
</style>
