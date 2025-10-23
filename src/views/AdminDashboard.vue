
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../composables/axios.js";

const roles = ref([]);
const permissions = ref([]);
const selectedPermissions = ref({});
const loading = ref(true);



async function fetchRolesPermissions () {
  loading.value = true;
  try {
    const res =  await api.get("roles-permissions");
    roles.value = res.data.roles;
    permissions.value = res.data.permissions;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function  assignPermissions  (roleId) {
  try {
    await api.post(`roles/${roleId}/permissions`, {
      permissions: selectedPermissions.value[roleId] || []
    });
    Swal.fire("Success", "Permissions updated successfully", "success");
    await fetchRolesPermissions(); // refresh
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to assign permissions", "error");
  }
}
onMounted(async () => {
  await fetchRolesPermissions();
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Roles & Permissions</h2>

    <div v-if="loading">Loading...</div>

    <div v-else class="grid gap-4">
      <div v-for="role in roles" :key="role.id" class="p-4 border rounded shadow-sm bg-white">
        <h3 class="text-lg font-semibold mb-2">{{ roles.name }}</h3>

        <div class="flex flex-wrap gap-2 mb-3">
          <span
              v-for="perm in role.permissions"
              :key="perm.id"
              class="px-2 py-1 text-sm rounded bg-green-100 text-green-800"
          >
            {{ perm.name }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <select v-model="selectedPermissions[role.id]" multiple class="border p-2 rounded w-1/2">
            <option v-for="perm in permissions" :key="perm.id" :value="perm.name">
              {{ perm.name }}
            </option>
          </select>

          <button
              @click="assignPermissions(role.id)"
              class="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            Assign Selected
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
select {
  min-height: 100px;
}
</style>
