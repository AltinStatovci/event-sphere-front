<script setup>
import { useCategoryStore } from '@/store/categoryStore';
import { useRouter } from 'vue-router';
import {onMounted, ref} from "vue"; // Import for routing

const categoryStore = useCategoryStore();
const router = useRouter();

const categories = ref([]);

const handleCategoryClick = (categoryId) => {
  router.push({ name: `eventByCategory`, params: { id: categoryId } });


};

onMounted(async () => {
  const fetchedCategories = await categoryStore.getAllCategories();
  categories.value = fetchedCategories.map(category => ({
    categoryName: category.categoryName,
    categoryId: category.id // Assuming the ID property is named "id"
  }));
});
</script>


<template>
  <li v-for="category in categories" :key="category.categoryId"> <button class="dropdown-item" @click="handleCategoryClick(category.categoryId)">  {{ category.categoryName }} </button>
  </li>
</template>

<style scoped>
/* Add Bootstrap CSS or your preferred styling for the dropdown */
</style>