<template>
    <div class="dashboard" :style="{ backgroundColor: isDarkMode ? '#0f172a' : '#3fa387' }">
        <!-- Write Report Button -->
        <button class="write-report-btn" @click="openModal">
            <span class="material-symbols-outlined icon" style="font-size: 2rem;">edit_note</span>
            <p>Write Report</p>
        </button>

        <!-- Display user's name -->
        <h1>Hello, {{ isLoggedIn && loggedInUser.email ? `User: ${loggedInUser.email}` : 'Guest' }}</h1>


        <!-- Modal Component -->
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <span class="close-button" @click="closeModal">&times;</span>
                <div class="complaint-form">
                    <span class="material-symbols-outlined icon"
                        style="font-size: 3rem; margin-left: 260px;">report</span>
                    <h1>{{ modalTitle }}</h1>

                    <!-- Report Form Fields -->
                    <div class="form-group">
                        <label class="form-label">First Name</label>
                        <input class="form-field" v-model="firstName" placeholder="Enter your first name" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Last Name</label>
                        <input class="form-field" v-model="lastName" placeholder="Enter your last name" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input class="form-field" :value="loggedInUser ? loggedInUser.email : ''"
                            placeholder="Enter your email" readonly />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Report Description</label>
                        <textarea class="form-field" v-model="complaintDescription" rows="5"
                            placeholder="Describe your report"></textarea>
                    </div>

                    <!-- Report Answer Field (only in respond modal) -->
                    <div v-if="modalTitle === 'Update Report'" class="form-group">
                        <label class="form-label">Report Answer</label>
                        <textarea class="form-field" v-model="reportAnsw" rows="5" placeholder="Respond"></textarea>
                    </div>

                    <!-- Submit Button -->
                    <button class="submit-btn" @click="submitComplaint">{{ modalButton }}</button>
                </div>
            </div>
        </div>

        <!-- List of Reports -->
        <div class="report-cards-container">
            <div v-for="report in reports" :key="report.reportId" class="report-card">
                <div class="card-header">
                    <h2 class="card-title">{{ report.userName }} </h2>
                    <p class="card-email">{{ loggedInUser.email }}</p>
                </div>
                <div class="card-body">
                    <p>{{ report.reportDesc }}</p>
                    <p>Status: {{ report.reportAnsw }}</p>
                    <span v-if="report.reportAnsw === 'Waiting for Respond'"
                        class="material-symbols-outlined icon">error</span>
                    <span v-else class="material-symbols-outlined icon">check</span>
                    <!-- Respond Button -->

                </div>
                <button class="respond-btn" :style="{ border: '7px solid ' + (isDarkMode ? '#0f172a' : '#3fa387') }"
                    @click="openUpdateModal(report)">
                    <span class="material-symbols-outlined icon">business_messages</span>
                    Respond
                </button>

            </div>
            <div v-if="reports.length === 0" class="no-data">No reports available</div>
        </div>

        <!-- Dark Mode Button -->
        <div class="dark-mode-button-container">
            <button @click="toggleDarkMode" class="dark-mode-button">
                <span class="material-symbols-outlined icon">dark_mode</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, readonly } from 'vue';
import { useAuthStore } from '../store/authStore'; // Adjust the path as per your project structure

const { logOut, isLoggedIn, loggedInUser } = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const complaintDescription = ref('');
const reportAnsw = ref(''); // New field for Report Answer
const isDarkMode = ref(false);
const isModalOpen = ref(false);
const modalTitle = ref('');
const modalButton = ref('');
const reports = ref([]);
const selectedReport = ref(null);

// Fetch initial data on component mount
onMounted(() => {
    fetchReports();
    fetchUserDetails();
});

const fetchUserDetails = async () => {
    try {
        if (isLoggedIn.value && loggedInUser.value) {
            // Fetch user details using loggedInUser.id
            const response = await fetch(`http://localhost:5220/api/User/getUser/${loggedInUser.value.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user details: ${response.statusText}`);
            }

            const userData = await response.json();
            console.log('User data:', userData);
            email.value = userData.email;
        }
    } catch (error) {
        console.error('Error fetching user details:', error.message);
    }
};

const fetchReports = async () => {
    try {
        const response = await fetch(`http://localhost:5220/api/Report`);
        if (!response.ok) {
            throw new Error(`Failed to fetch reports: ${response.statusText}`);
        }
        const reportData = await response.json();
        reports.value = reportData;
    } catch (error) {
        console.error('Error fetching reports:', error.message);
    }
};

const submitComplaint = async () => {
    let apiUrl = 'http://localhost:5220/api/Report';
    let method = 'POST';
    let complaintData = {
        userId: 1, // Replace with actual user ID or fetch from authentication
        userName: firstName.value,
        userlastName: lastName.value,
        userEmail: email.value,
        reportName: 'Sample Report', // Provide a report name or fetch dynamically
        reportDesc: complaintDescription.value,
        reportAnsw: 'Waiting for Respond' // Default status
    };

    if (modalTitle.value === 'Update Report') {
        apiUrl = `http://localhost:5220/api/Report/${selectedReport.value.reportId}`;
        method = 'PUT';
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
            },
            body: JSON.stringify(complaintData),
        });

        if (!response.ok) {
            throw new Error(`Failed to ${method === 'POST' ? 'submit' : 'update'} report: ${response.statusText}`);
        }

        console.log(`${method === 'POST' ? 'Report submitted' : 'Report updated'} successfully`);
        fetchReports(); // Refresh the reports list
        closeModal();
    } catch (error) {
        console.error(`Error ${method === 'POST' ? 'submitting' : 'updating'} report:`, error.message);
    }
};
const openModal = () => {
    modalTitle.value = 'Report Form';
    modalButton.value = 'Submit Report';
    // Clear form fields
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    complaintDescription.value = '';
    reportAnsw.value = '';
    isModalOpen.value = true;
};

const openUpdateModal = (report) => {
    selectedReport.value = report;
    modalTitle.value = 'Update Report';
    modalButton.value = 'Update';
    // Fill form fields with report data
    firstName.value = report.userName;
    lastName.value = report.userlastName;
    email.value = report.userEmail;
    complaintDescription.value = report.reportDesc;
    reportAnsw.value = report.reportAnsw;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
};
</script>

<style scoped>
.dashboard {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90vh;
    transition: background-color 0.3s ease;
}

.write-report-btn {
    padding: 10px 20px;
    background-color: #ffffff;
    color: #000000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.write-report-btn:hover {
    background-color: #2a865d;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 600px;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    cursor: pointer;
}

.report-cards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.report-card {
    position: relative;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    padding: 20px;
}

.card-header {
    margin-bottom: 10px;
}

.card-title {
    margin: 0;
    font-size: 1.2rem;
}

.card-email {
    margin: 0;
    color: #888;
    font-size: 0.8rem;
}

.card-body {
    font-size: 0.9rem;
    position: relative;
}

.respond-btn {
    position: absolute;
    bottom: -20px;
    /* Adjust as needed */
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 10px;
    background-color: #2a865d;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.respond-btn:hover {
    background-color: #1e6a48;
}

.no-data {
    text-align: center;
    font-style: italic;
    color: #999;
}

.complaint-form {
    max-width: 600px;
    width: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-label {
    font-weight: bold;
}

.form-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #f9f9f9;
    font-size: 14px;
}

textarea.form-field {
    resize: vertical;
}

.submit-btn {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #3fa387;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background-color: #349e76;
}

.dark-mode-button-container {
    text-align: center;
    margin-top: 20px;
    /* Adjust margin as needed */
}

.dark-mode-button {
    padding: 10px 20px;
    background-color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.dark-mode-button:hover {
    background-color: #cccccc;
    color: #ffffff;
}

.respond-btn {
    padding: 5px 10px;
    background-color: #2a865d;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    margin-top: 10px;
}

.respond-btn:hover {
    background-color: #1e6a48;
}
</style>
