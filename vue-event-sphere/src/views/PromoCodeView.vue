<script setup>
import {ref, reactive, onMounted, computed, watch} from 'vue';
import SideBar from "@/components/SideBar.vue";
import { usePromoCodeStore } from '@/store/promoCodeStore';
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';

const promoCodeStore = usePromoCodeStore();
const router = useRouter();

const activeTab = ref('promoCodeList');
const promoCodes = ref([]);
const selectedPromoCodeId = ref(null);
const isEditMode = ref(false);
const formData = reactive({
  code: '',
  discountPercentage: 0,
  expiryDate: '',
  isValid: false,
});

const fetchPromoCodes = async () => {
  await promoCodeStore.fetchPromoCodes();
  promoCodes.value = promoCodeStore.promoCodes;
};

onMounted(fetchPromoCodes);

const handleSubmit = async () => {
  if (isEditMode.value) {
    await updatePromoCode();
  } else {
    await createPromoCode();
  }
  await fetchPromoCodes(); 
  changeTab('promoCodeList');
  resetForm();
};

const createPromoCode = async () => {
  try {
    await promoCodeStore.createPromoCode(formData);
    Swal.fire({
      title: "Promo Code Created successfully!",
      icon: "success",
    }).then(() => {
      resetForm();
      fetchPromoCodes();
      activeTab.value = 'promoCodeList';  // Ensure this is correct
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.response ? err.response.data : err.message,
      icon: "error",
    });
  }
};

const updatePromoCode = async () => {
  try {
    await promoCodeStore.updatePromoCode(selectedPromoCodeId.value, formData);
    Swal.fire({
      title: "Promo Code Updated successfully!",
      icon: "success",
    }).then(() => {
      resetForm();
      fetchPromoCodes();
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.response ? err.response.data : err.message,
      icon: "error",
    });
  }
};

const deletePromoCode = async (promoCodeId) => {
  try {
    await promoCodeStore.deletePromoCode(promoCodeId);
    Swal.fire({
      title: "Promo Code Deleted successfully!",
      icon: "success",
    }).then(() => {
      fetchPromoCodes();
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.response ? err.response.data : err.message,
      icon: "error",
    });
  }
};

const editPromoCode = (promoCode) => {
  Object.assign(formData, {
    ...promoCode,
    expiryDate: promoCode.expiryDate.split('T')[0] // Keeping the exact date part only
  });
  selectedPromoCodeId.value = promoCode.id;
  isEditMode.value = true;
  activeTab.value = 'promoCodeForm';
};

const changeTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'promoCodeForm' && !isEditMode.value) resetForm();
};

const resetForm = () => {
  isEditMode.value = false;
  selectedPromoCodeId.value = null;
  formData.code = '';
  formData.discountPercentage = 0;
  formData.expiryDate = '';
  formData.isValid = false;
};


const currentPagePromoCode = ref(1)
const pageSizePromoCode = 6;

const sortedPromoCodes = computed(() => {
  return [...promoCodes.value].sort((a, b) => b.discountPercentage - a.discountPercentage);
});

const paginatedPromoCodes = computed(() => {
  const startIndex = (currentPagePromoCode.value - 1) * pageSizePromoCode;
  return sortedPromoCodes.value.slice(startIndex, startIndex + pageSizePromoCode);
});

const totalPagesPromoCodes = computed(() => Math.ceil(promoCodes.value.length / pageSizePromoCode));

const setCurrentPagePromoCodes = (page) => {
  currentPagePromoCode.value = page;
};


watch(() => promoCodes.value, () => {
  setCurrentPagePromoCodes(1); // Reset to first page when users change
});


</script>



<template>
  <div class="d-flex">
    <side-bar />
    <div class="container-xl px-4 mt-4">
      <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'promoCodeList' }" @click.prevent="changeTab('promoCodeList')">Promo Code List</a>
        <a class="nav-link" :class="{ active: activeTab === 'promoCodeForm' }" @click.prevent="changeTab('promoCodeForm')">{{ isEditMode ? 'Edit Promo Code' : 'Create Promo Code' }}</a>
      </nav>
      <hr class="mt-0 mb-4">

      <div v-if="activeTab === 'promoCodeList'" class="card mb-4">
        <div class="card-header d-flex justify-content-between">
          Promo Codes
          
        </div>
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Discount (%)</th>
                <th scope="col">Expiry Date</th>
                <th scope="col">Is Valid</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="promoCode in paginatedPromoCodes" :key="promoCode.id">
                <td>{{ promoCode.code }}</td>
                <td>{{ promoCode.discountPercentage }}</td>
                <td>{{ new Date(promoCode.expiryDate).toLocaleDateString() }}</td>
                <td>{{ promoCode.isValid ? 'Yes' : 'No' }}</td>
                <td>
                  <button class="btn btn-outline-primary btn-sm" @click="() => { editPromoCode(promoCode); }">Edit</button>
                  <button class="btn btn-outline-danger btn-sm" @click="() => deletePromoCode(promoCode.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <nav v-if="promoCodes.length > 0">
            <ul class="pagination justify-content-center">
              <li
                  class="page-item"
                  v-for="page in totalPagesPromoCodes"
                  :key="page"
                  :class="{ active: currentPagePromoCode === page }"
              >
                <a class="page-link" href="#" @click.prevent="setCurrentPagePromoCodes(page)">{{ page }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div v-if="activeTab === 'promoCodeForm'" class="card mb-4">
        <div class="card-header">{{ isEditMode ? 'Edit Promo Code' : 'Create Promo Code' }}</div>
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="code" class="form-label">Code</label>
              <input type="text" v-model="formData.code" class="form-control" id="code" required />
            </div>
            <div class="mb-3">
              <label for="discountPercentage" class="form-label">Discount Percentage</label>
              <input type="number" v-model="formData.discountPercentage" class="form-control" id="discountPercentage" required min="0" max="100" />
            </div>
            <div class="mb-3">
              <label for="expiryDate" class="form-label">Expiry Date</label>
              <input type="date" v-model="formData.expiryDate" class="form-control" id="expiryDate" required />
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="formData.isValid" id="isValid" />
                <label class="form-check-label" for="isValid">Is Valid</label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update Promo Code' : 'Create Promo Code' }}</button>
            <button type="button" class="btn btn-secondary" @click="() => { resetForm(); changeTab('promoCodeList'); }">Cancel</button>
          </form>
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
