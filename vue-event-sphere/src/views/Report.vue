<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import SideBar from "@/components/SideBar.vue";
import { useAuthStore } from '@/store/authStore';
import { useReportStore } from '@/store/reportStore';
import { useUserStore } from '@/store/userStore';
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';

const authstore = useAuthStore();
const reportStore = useReportStore();
const userStore = useUserStore();
const router = useRouter();
const selectedReportId = ref(null);
const isEditMode = ref(false);
const activeTab = ref('reportList');
const selectedReport = ref(null);
const reportName = ref('');
const complaintDescription = ref('');
const reportAnsw = ref('');
const reports = ref([]);
const usersWithReports = ref([]);
const selectedUserId = ref(null);

const user = reactive({
  id: authstore.id,
  name: '',
  lastName: '',
  email: '',
  roleID: '',
  roleName: '',
});

onMounted(async () => {
  await fetchUserDetails();
  await fetchReports();
});

const fetchReports = async () => {
  try {
    let response;
    if (user.roleName === 'Admin') {
      response = await fetch('http://localhost:5220/api/Report', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authstore.token}`,
        },
      });
    } else if (user.roleName === 'User' || user.roleName === 'Organizer') {
      response = await fetch(`http://localhost:5220/api/Report/GetReportByUserId/${authstore.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authstore.token}`,
        },
      });
    }
    if (!response.ok) throw new Error(`Failed to fetch reports: ${response.statusText}`);
    reports.value = await response.json();
    groupReportsByUser();
  } catch (error) {
    console.error('Error fetching reports:', error.message);
  }
};

const groupReportsByUser = () => {
  const grouped = reports.value.reduce((acc, report) => {
    const userId = report.userId;
    if (!acc[userId]) {
      acc[userId] = { user: report.userName + ' ' + report.userlastName, count: 0, reports: [] };
    }
    acc[userId].count += 1;
    acc[userId].reports.push(report);
    return acc;
  }, {});
  usersWithReports.value = Object.entries(grouped).map(([userId, data]) => ({
    userId,
    ...data,
  }));
};

const fetchUserDetails = async () => {
  try {
    const response = await userStore.getUser(authstore.id);
    Object.assign(user, response);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
  }
};

const handleSubmit = async () => {
  let apiUrl = 'http://localhost:5220/api/Report';
  let method = 'POST';
  let complaintData = {
    userId: user.id,
    userName: user.name,
    userlastName: user.lastName,
    userEmail: user.email,
    reportName: reportName.value,
    reportDesc: complaintDescription.value,
    reportAnsw: 'Waiting for Respond'
  };

  if (isEditMode.value) {
    apiUrl = `http://localhost:5220/api/Report/${selectedReportId.value}`;
    method = 'PUT',

        complaintData = {
          ...selectedReport.value,
          reportDesc: complaintDescription.value,
          reportAnsw: reportAnsw.value
        };
  }

  try {
    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authstore.token}`
      },
      body: JSON.stringify(complaintData),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${isEditMode.value ? 'update' : 'create'} report: ${response.statusText}`);
    }

    // If successful, fetch updated reports and reset form
    await fetchReports();
    changeTab('reportList');

    // Show success notification based on the mode
    if (isEditMode.value) {
      Swal.fire({
        title: "Report Responded Successfully!",
        icon: "success"
      });
      resetForm();
    } else {
      Swal.fire({
        title: "Report Created Successfully!",
        icon: "success"
      });
    }
  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} report:`, error.message);

    // Show error notification
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error"
    });
  }
};

const openUpdateModal = (report) => {
  isEditMode.value = true; // Set isEditMode to true
  if (report && report.reportId) {
    selectedReport.value = report;
    selectedReportId.value = report.reportId;
    activeTab.value = 'reportForm';
    reportName.value = report.reportName;
    complaintDescription.value = report.reportDesc;
    reportAnsw.value = report.reportAnsw;
  } else {
    console.error("Invalid report object or missing report ID");
  }
};

const changeTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'reportForm' && !isEditMode.value) resetForm();
};

const deleteReport = async (reportId) => {
  try {
    await reportStore.deleteReport(reportId);
    Swal.fire({
      title: "Report Deleted successfully!",
      icon: "success"
    }).then(() => {
      location.reload();
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.value,
      icon: "error"
    });
  }
};

const resetForm = () => {
  isEditMode.value = false;
  reportName.value = '';
  complaintDescription.value = '';
  reportAnsw.value = '';
};

const showStatusModal = ref(false);
const selectedStatus = ref('');

const openStatusModal = (status) => {
  selectedStatus.value = status;
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  selectedStatus.value = '';
};

const currentPageUser = ref(1);
const pageSizeUser = 10;

const paginatedUsers = computed(() => {
  const startIndex = (currentPageUser.value - 1) * pageSizeUser;
  return usersWithReports.value.slice(startIndex, startIndex + pageSizeUser);
});

const totalPagesUser = computed(() => Math.ceil(usersWithReports.value.length / pageSizeUser));

const setCurrentPageUser = (page) => {
  currentPageUser.value = page;
};

const showUserReports = (userId) => {
  selectedUserId.value = userId;
};

const clearUserReports = () => {
  selectedUserId.value = null;
};

watch(() => reports.value, () => {
  currentPageUser.value = 1; // Reset to first page when reports change
});

</script>

<template>
  <div class="d-flex">
    <side-bar />
    <div class="container-xl px-4 mt-4">
      <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'reportList' }" @click.prevent="changeTab('reportList')">Report List</a>
        <a class="nav-link" :class="{ active: activeTab === 'reportForm' }" @click.prevent="changeTab('reportForm')">Report Form</a>
      </nav>
      <hr class="mt-0 mb-4">

      <div v-if="activeTab === 'reportList'">
        <div class="card mb-4" v-if="!selectedUserId">
          <div class="card-header">Users with Reports</div>
          <div class="card-body">
            <table class="table">
              <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Number of Reports</th>
                <th scope="col">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in paginatedUsers" :key="user.userId">
                <td>{{ user.user }}</td>
                <td>{{ user.count }}</td>
                <td>
                  <button class="btn btn-outline-primary btn-sm" @click="showUserReports(user.userId)">View Reports</button>
                </td>
              </tr>
              <tr v-if="usersWithReports.length === 0">
                <td colspan="3" class="no-data">No users with reports available</td>
              </tr>
              </tbody>
            </table>
            <nav v-if="usersWithReports.length > 0">
              <ul class="pagination justify-content-center">
                <li class="page-item" v-for="page in totalPagesUser" :key="page" :class="{ active: currentPageUser === page }">
                  <a class="page-link" href="#" @click.prevent="setCurrentPageUser(page)">{{ page }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="card mb-4" v-if="selectedUserId">
          <div class="card-header d-flex justify-content-between">

            Reports of User: {{ usersWithReports.find(user => user.userId === selectedUserId)?.user }}
            <button class="btn btn-outline-primary btn-sm" @click="clearUserReports">Back to Users</button>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
              <tr>
                <th scope="col">Report Name</th>
                <th scope="col">Report Description</th>
                <th scope="col">Report Answer</th>
                <th scope="col">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="report in usersWithReports.find(user => user.userId === selectedUserId)?.reports" :key="report.reportId">
                <td>{{ report.reportName }}</td>
                <td>{{ report.reportDesc }}</td>
                <td>{{ report.reportAnsw }}</td>
                <td>
                  <button class="btn btn-info btn-sm"
                          @click="openStatusModal(report.reportAnsw)">Read</button>
                  <button class="btn btn-danger btn-sm" @click="deleteReport(report.reportId)">Delete</button>
                  <button v-if="user.roleName == 'Admin'" class="btn btn-success btn-sm"
                          @click="openUpdateModal(report)">Respond</button>
                </td>
              </tr>
              <tr v-if="!usersWithReports.find(user => user.userId === selectedUserId)?.reports.length">
                <td colspan="4" class="no-data">No reports available</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Status Read Modal -->
      <div v-if="showStatusModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">status</h5>
              <button type="button" class="btn-close" @click="closeStatusModal"></button>
            </div>
            <div class="modal-body">
              <textarea rows="5" class="form-control" readonly>{{ selectedStatus }}</textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeStatusModal">Close</button>
            </div>
          </div>
        </div>
      </div>


      <div v-if="activeTab === 'reportForm'">
        <div class="card mb-4">
          <div class="card-header">{{ isEditMode ? 'Update Report' : 'Create Report' }}</div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="reportName" class="form-label">Report Name</label>
                <input type="text" class="form-control" id="reportName" v-model="reportName" required>
              </div>
              <div class="mb-3">
                <label for="complaintDescription" class="form-label">Report Description</label>
                <textarea class="form-control" id="complaintDescription" v-model="complaintDescription" required></textarea>
              </div>
              <div class="mb-3" v-if="isEditMode">
                <label for="reportAnsw" class="form-label">Report Answer</label>
                <textarea class="form-control" id="reportAnsw" v-model="reportAnsw" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update Report' : 'Create Report' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
    margin-top: 20px;
    background-color: #f2f6fc;
    color: #69707a;
}

.img-account-profile {
    height: 10rem;
}

.rounded-circle {
    border-radius: 50% !important;
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


.image-container {
    width: 150px;
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0 auto;
    border: 1px solid #ccc;
}

.image-container .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #999;
    text-align: center;
}


.btn {
    text-transform: capitalize;
}
.no-data {
    text-align: center;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    color: #999;
}

</style>
