import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useReportStore = defineStore('report', () => {
    const url = 'http://localhost:5220/api/';
    const reports = ref([]);
    const report = ref(null);

    async function fetchReports() {
        try {
            const response = await axios.get(`${url}Report`);
            reports.value = response.data;
        } catch (err) {
            console.error("Error fetching reports:", err);
        }
    }

    async function getReportById(id) {
        try {
            const response = await axios.get(`${url}Report/${id}`);
            report.value = response.data;
            return report.value;
        } catch (err) {
            console.error("Error fetching report:", err);
            return null;
        }
    }

    async function submitReport(reportData) {
        try {
            const response = await axios.post(`${url}Report`, reportData);
            fetchReports(); // Refresh the reports list
            return response.data;
        } catch (err) {
            console.error("Error submitting report:", err);
        }
    }

    async function updateReport(reportId, reportData) {
        try {
            const response = await axios.put(`${url}Report/${reportId}`, reportData);
            fetchReports(); // Refresh the reports list
            return response.data;
        } catch (err) {
            console.error("Error updating report:", err);
        }
    }
    async function deleteReport(id){
        try {
            await axios.delete(`${url}Report/${id}`);
            }
        catch (error) {
            console.error('Error deleting expenses:', error);
            throw error;
        }
        
    }
    
    return { reports, report, fetchReports, getReportById, submitReport, updateReport,deleteReport };
});