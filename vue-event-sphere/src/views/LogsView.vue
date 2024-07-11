<script setup>
import { ref, onMounted } from 'vue';
import SideBar from "@/components/SideBar.vue";
import { useAuthStore } from "@/store/authStore.js";
import { useLogStore } from "@/store/logStore.js";
import LogTableComponent from "@/components/logTable/LogTableComponent.vue";

const logsStore = useLogStore();
const logs = ref([]);
const activeTab = ref('Information'); // Default active tab

const fetchLogs = async (level) => {
  await logsStore.getLogs(level);
  logs.value = logsStore.logs;
};

const changeTab = (tab) => {
  activeTab.value = tab;
};

const formatLogDateTime = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
  return `${formattedDate} - ${formattedTime}`;
};

const handleTabChange = (tab) => {
  switch (tab) {
    case 'Information':
      fetchLogs('Information');
      changeTab("Information");
      break;
    case 'Error':
      fetchLogs('Error');
      changeTab("Error");
      break;
    case 'Fatal':
      fetchLogs('Fatal');
      changeTab("Fatal");
      break;
    default:
      fetchLogs('Information');
      break;
  }
};

onMounted(async () => {
  await fetchLogs('Information'); // Fetch logs for default tab on component mount
});
</script>

<template>
  <div class="d-flex">
    <SideBar />
    <div class="container-xl px-4 mt-4">
      <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'Information' }" @click.prevent="handleTabChange('Information')">Success</a>
        <a class="nav-link" :class="{ active: activeTab === 'Error' }" @click.prevent="handleTabChange('Error')">Error</a>
        <a class="nav-link" :class="{ active: activeTab === 'Fatal' }" @click.prevent="handleTabChange('Fatal')">Fatal</a>

      </nav>
      <hr class="mt-0 mb-4">

      <div>

          <LogTableComponent :logs="logs"
                             :fetchLogs="fetchLogs"
                             :formatLogDateTime="formatLogDateTime"/>
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




.nav-borders .nav-link.active {
  color: #0061f2;
  border-bottom-color: #0061f2;
}

.nav-borders .nav-link {
  color: #69707a;
  border-bottom-width: 0.125rem;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0;
  padding-right: 0;
  margin-left: 1rem;
  margin-right: 1rem;
  cursor: pointer;
}

</style>

