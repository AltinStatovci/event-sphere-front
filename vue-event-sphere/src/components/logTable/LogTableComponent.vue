<script setup>
import { defineProps, ref, computed, watch } from 'vue';

const props = defineProps({
  logs: Array,
  fetchLogs: Function,
  formatLogDateTime: Function
});

const currentPage = ref(1);
const pageSize = 10;

const paginatedLogs = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  return props.logs.slice(startIndex, startIndex + pageSize);
});

const totalPages = computed(() => Math.ceil(props.logs.length / pageSize));

const setCurrentPage = (page) => {
  currentPage.value = page;
};

watch(() => props.logs, () => {
  setCurrentPage(1); // Reset to first page when logs change
});

</script>
<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">Logs List</div>
      <div class="card-body">
        <table class="table">
          <thead>
          <tr>
            <th>Level</th>
            <th>Date</th>
            <th>Message</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(log, index) in paginatedLogs" :key="log.id">
            <td>{{ log.level }}</td>
            <td>{{ formatLogDateTime(log.timeStamp) }}</td>
            <td>{{ log.messageTemplate.split(':').slice(0, -1).join(':') }}</td>
          </tr>
          <tr v-if="logs.length === 0">
            <td colspan="3" class="no-data">No Logs available</td>
          </tr>
          </tbody>
        </table>
        <nav v-if="logs.length > 0">
          <ul class="pagination justify-content-center">
            <li class="page-item" v-for="(page, index) in totalPages" :key="index" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="setCurrentPage(page)">{{ page }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>


<style scoped>
h1 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

.no-data {
  text-align: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  color: #999;
}

.card {
  box-shadow: 0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%);
}

.card .card-header {
  font-weight: 500;
}

.card-header:first-child {
  border-radius: 0.35rem 0.35rem 0 0;
}

.card-header {
  padding: 1rem 1.35rem;
  margin-bottom: 0;
  background-color: rgba(33, 40, 50, 0.03);
  border-bottom: 1px solid rgba(33, 40, 50, 0.125);
}

.pagination {
  margin-top: 20px;
}

.pagination .page-item {
  display: inline-block;
  margin-right: 0.5rem;
}

.pagination .page-link {
  color: #0061f2;
  border: 1px solid #0061f2;
  padding: 0.5rem 0.75rem;
}

.pagination .page-link:hover {
  background-color: #0061f2;
  color: #fff;
}

.pagination .page-item.active .page-link {
  background-color: #0061f2;
  color: #fff;
  border-color: #0061f2;
}

</style>
