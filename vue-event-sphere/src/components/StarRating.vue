<template>
  <div class="star-rating">
    <span
      v-for="star in maxStars"
      :key="star"
      class="star"
      :class="{ filled: star <= internalRating }"
      @click="setRating(star)"
    >
      &#9733;
    </span>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      default: 0
    },
    maxStars: {
      type: Number,
      default: 5
    }
  },
  emits: ['update:rating'],
  data() {
    return {
      internalRating: this.rating
    };
  },
  methods: {
    setRating(star) {
      this.internalRating = star;
      this.$emit('update:rating', star);
    }
  }
};
</script>

<style scoped>
.star {
  font-size: 1.5rem;
  color: #d3d3d3;
  cursor: pointer;
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}
</style>
