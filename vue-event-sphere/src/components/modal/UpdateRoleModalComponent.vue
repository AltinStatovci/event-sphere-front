<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h5>Update User Role</h5>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="updateRole">
          <div class="mb-3">
            <label class="form-label" for="roleSelect">Role</label>
            <select id="roleSelect" class="form-select" v-model="selectedRoleId">
              <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.roleName }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Save changes</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useUserStore } from "@/store/userStore.js";
import Swal from "sweetalert2";

const props = defineProps({
  showModal: Boolean,
  user: Object
});

const emit = defineEmits(['close']);

const userStore = useUserStore();
const roles = ref([]);
const selectedRoleId = ref(null);

const fetchRoles = async () => {
  try {
    roles.value = await userStore.getRoles();
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const updateRole = async () => {
  try {
    await userStore.updateUser({ ...props.user, roleID: selectedRoleId.value, roleName: roles.value.find(role => role.id === selectedRoleId.value).roleName });
    await Swal.fire({
      title: "User Role updated successfully!",
      icon: "success"
    }).then(() => {
      emit('close');

    }).then(() => {
      location.reload()
    });

  } catch (error) {
    console.error('Error updating user role:', error);
  }
};

watch(() => props.showModal, async (newVal) => {
  if (newVal) {
    await fetchRoles();
    selectedRoleId.value = props.user.roleID;
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
}
</style>
