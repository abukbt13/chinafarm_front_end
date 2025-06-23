
<script setup>
import { ref, onMounted } from 'vue';
import Navbar from "../../components/Navbar.vue";
// Assumes you've created a configured axios instance

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await axios.get('/users');
    const currentUserId = parseInt(localStorage.getItem('user_id'));
    users.value = response.data.filter(user => user.id !== currentUserId);
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

onMounted(fetchUsers);
</script>
<template>
  <Navbar />
  <div class="d-flex">
    <!-- Sidebar -->
    <aside class="bg-dark text-white p-3 vh-100" style="width: 250px;">
      <h4 class="mb-4">China Farm</h4>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <a class="nav-link text-white" href="#">Dashboard</a>
        </li>
        <li class="nav-item mb-2">
          <a class="nav-link text-white" href="#">Users</a>
        </li>
        <li class="nav-item mb-2">
          <a class="nav-link text-white" href="#">Bookings</a>
        </li>
        <li class="nav-item mb-2">
          <a class="nav-link text-white" href="#">Vehicles</a>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow-1 p-4">
      <h2 class="mb-4">Dashboard</h2>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Users (excluding you)</h5>
          <p class="card-text">Total: {{ users.length }}</p>
        </div>
      </div>
    </main>
  </div>
</template>


<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
