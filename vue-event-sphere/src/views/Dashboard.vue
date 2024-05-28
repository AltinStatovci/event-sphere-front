<script setup>
import { ref, onMounted } from 'vue';
import SideBar from "@/components/SideBar.vue";

const categories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await fetch('https://localhost:5220/api/EventCategory');
    if (!response.ok) {
      throw new Error('Failed to fetch event categories');
    }
    const data = await response.json();
    categories.value = data;
    console.log('Fetched categories:', categories.value);
  } catch (error) {
    console.error('Error fetching event categories:', error);
  }
};

onMounted(() => {
  fetchCategories();
});

const editCategory = (id) => {
  console.log('Edit category:', id);
  // Implement your edit logic here
};

const viewCategory = (id) => {
  console.log('View category:', id);
  // Implement your view logic here
};

const deleteCategory = (id) => {
  console.log('Delete category:', id);
  // Implement your delete logic here
};
</script>


<template>

  <div class="dashboard" style="margin-left: 300px;">
    <side-bar/>
    <h1>Event Categories</h1>

    <div class="table-container">
      <table class="category-table">
        <thead>
        <tr>
          <th class="id-col">ID</th>
          <th class="name-col">Category Name</th>
          <th class="action-col">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.categoryName }}</td>
          <td>
            <button class="action-btn edit-btn" @click="editCategory(category.id)">Edit</button>
            <button class="action-btn view-btn" @click="viewCategory(category.id)">View</button>
            <button class="action-btn delete-btn" @click="deleteCategory(category.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="categories.length === 0">
          <td colspan="3" class="no-data">No categories available</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>



<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f4f4f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


h1 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

.table-container {
  overflow-x: auto;
}

.category-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-table th,
.category-table td {
  border: 1px solid #e0e0e0;
  padding: 14px 20px;
  text-align: left;
}

.category-table th {
  background-color: #212121;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 1;
}

.category-table td {
  color: #333;
  font-size: 16px;
}

.category-table tbody tr:nth-child(even) {
  background-color: #f5f5f5;
}

.category-table tbody tr:hover {
  background-color: #ececec;
}

.action-btn {
  padding: 8px 16px;
  margin-right: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  outline: none;
}

.edit-btn {
  background-color: #4CAF50;
  color: white;
}

.view-btn {
  background-color: #1976d2;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.no-data {
  text-align: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  color: #999;
}
</style>