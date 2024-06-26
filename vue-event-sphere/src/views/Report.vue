<template>
    <div class="d-flex">
        <side-bar />
        <div class="container-xl px-4 mt-4">
            <nav class="nav nav-borders">
                <a class="nav-link" :class="{ active: activeTab === 'reportList' }"
                    @click.prevent="changeTab('reportList')">Report List</a>
                <a class="nav-link" :class="{ active: activeTab === 'reportForm' }"
                    @click.prevent="changeTab('reportForm')">Report Form</a>
            </nav>
            <hr class="mt-0 mb-4">

            <div v-if="activeTab === 'reportList'">
                <div class="card mb-4">
                    <div class="card-header">Report List</div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Lastname</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Report Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="report in reports" :key="report.id">
                                    <td>{{ report.userName }}</td>
                                    <td>{{ report.userlastName }}</td>
                                    <td>{{ report.userEmail }}</td>
                                    <td>{{ report.reportName }}</td>
                                    <td>{{ report.reportDesc }}</td>
                                    <td>
                                        <button class="btn btn-info btn-sm"
                                            @click="openStatusModal(report.reportAnsw)">Read</button>
                                    </td>

                                    <td>
                                        <button class="btn btn-danger btn-sm"
                                            @click="deleteReport(report.reportId)">Delete</button>
                                        <button v-if="user.roleName == 'Admin'" class="btn btn-success btn-sm"
                                            @click="openUpdateModal(report)">Respond</button>
                                    </td>
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
                            <h5 class="modal-title">Status</h5>
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
                <div class="row">
                    <div class="col-xl-12">
                        <div class="card mb-4">
                            <div class="card-header">{{ isEditMode ? 'Edit Report' : 'Create Report' }}</div>
                            <div class="card-body">
                                <form @submit.prevent="handleSubmit">
                                    <div class="row gx-3 mb-3">
                                        <div class="col-md-6">
                                            <label class="small mb-1" for="userName">Name</label>
                                            <input class="form-control" id="userName" type="text"
                                                placeholder="Enter name" v-model="user.name" readonly>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="small mb-1" for="userlastName">Last Name</label>
                                            <input class="form-control" id="userlastName" type="text"
                                                placeholder="Enter last name" v-model="user.lastName" readonly>
                                        </div>
                                    </div>
                                    <div class="row gx-3 mb-3">
                                        <div class="col-md-12">
                                            <label class="small mb-1" for="userEmail">Email</label>
                                            <input class="form-control" id="userEmail" type="text"
                                                placeholder="Enter email" v-model="user.email" readonly>
                                            <br>
                                        </div>
                                        <br>
                                        <hr>
                                        <br>
                                        <div class="col-md-12">
                                            <label class="small mb-1" for="reportName">Report Name</label>
                                            <input class="form-control" id="reportName" type="text"
                                                placeholder="Enter report name" v-model="reportName">
                                        </div>
                                    </div>
                                    <div class="row gx-3 mb-3">
                                        <div class="col-md-12">
                                            <label class="small mb-1" for="reportDesc">Description</label>
                                            <textarea rows="5" cols="50" class="form-control" id="reportDesc"
                                                type="text" placeholder="Enter Your Report"
                                                v-model="complaintDescription"></textarea>
                                        </div>
                                        <div class="col-md-12" v-if="user.roleName === 'Admin'">
                                            <label class="small mb-1" for="reportAnsw">Status</label>
                                            <textarea class="form-control" id="reportAnsw" type="text"
                                                placeholder="Enter status" v-model="reportAnsw"></textarea>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary" type="submit">{{ isEditMode ? 'Update Report' :
                                        'Submit Report' }}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
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
        } else if (user.roleName === 'User') {
            response = await fetch(`http://localhost:5220/api/Report/GetReportByUserId/${authstore.id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authstore.token}`,
                },
            });
        }
        if (!response.ok) throw new Error(`Failed to fetch reports: ${response.statusText}`);
        reports.value = await response.json();
    } catch (error) {
        console.error('Error fetching reports:', error.message);
    }
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
            headers: { 'Content-Type': 'application/json'
            , 'Authorization': `Bearer ${authstore.token}`
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
}

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

</script>

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

.nav-borders {
    display: flex;
    flex-wrap: nowrap;
    padding-left: 0;
    margin-bottom: 1rem;
    list-style: none;
    overflow-x: auto;
    text-align: center;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
}

.nav-borders .nav-link {
    font-size: 0.88rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    margin-right: 1rem;
    border-bottom: 0.125rem solid transparent;
}

.nav-borders .nav-link.active {
    color: #0061f2;
    border-bottom-color: #0061f2;
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
</style>
