<script setup>
import { onMounted } from 'vue'
import Navbar from "../../components/Navbar.vue";

onMounted(() => {
  // Load Bootstrap’s Offcanvas JS if not globally loaded
  import('bootstrap/dist/js/bootstrap.bundle.min.js')
})
</script>

<template>
  <Navbar />
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Offcanvas Sidebar for Mobile -->
    <div class="offcanvas offcanvas-start bg-success text-white" tabindex="-1" id="sidebarOffcanvas">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">🌱 China Farm</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <router-link class="nav-link text-white" to="/admin/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link class="nav-link text-white" to="/admin/progress">Farm Progress</router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link class="nav-link text-white" to="/admin/bookings">Bookings</router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link class="nav-link text-white" to="/admin/crops">Crops</router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link class="nav-link text-white" to="/admin/seedlings">Seedlings</router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Static Sidebar for Desktop -->
    <nav class="d-none d-md-block bg-success text-white p-3 vh-100" style="width: 250px;">
      <h4 class="fw-bold mb-4">🌱 China Farm</h4>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/admin/progress">Active Crops</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/admin/bookings">Bookings</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/admin/crops">Crops</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/admin/seedlings">Seedlings</router-link>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <div class="flex-grow-1 w-100">
      <!-- Top Navbar -->
      <div class="bg-white border-bottom d-flex align-items-center justify-content-between px-3 py-2 shadow-sm sticky-top">
        <!-- Mobile Menu Toggle -->
        <button class="btn btn-outline-success d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas">
          ☰
        </button>
        <h5 class="mb-0">Admin Panel</h5>
      </div>
      <!-- Page Content -->
      <main class="container-fluid p-4 mt-3">
        <router-view /> <!-- 👈 This renders the child route like ActiveCrops -->
      </main>
    </div>
  </div>
</template>

<style scoped>
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
</style>
