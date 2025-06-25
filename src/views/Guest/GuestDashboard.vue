<script setup lang="ts">

import Navbar from "../../components/Navbar.vue";
</script>

<template>
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
        Guest
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>