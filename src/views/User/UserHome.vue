<script setup>

import {onMounted, ref} from "vue";
import api from "../../composables/axios.js";
const summary =ref([])
const fetchSummary = async () => {
  try {
    const res = await api.get('farming-projects/count')
    summary.value = res.data.summary
  } catch (err) {
    console.error('Failed to fetch summary:', err)
  }
}
onMounted( () => {
  fetchSummary()
})
</script>

<template>
    <div class="container my-5">
      <div class="row g-4">
        <!-- Active Crops -->
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm border-0 summary-card" style="background: #267026; color: white;">
            <router-link to="/user/farm-projects" class="text-decoration-none text-white">
            <div class="card-body text-center" >
              <h5 class="card-title fw-bold">🌱 Active Projects</h5>
              <p class="display-6 fw-semibold mb-2 text-center">
                {{ summary.activecrops }}
              </p>
                <span>View Projects</span> <i class="bi bi-arrow-right float-end"></i>
            </div>
            </router-link>
          </div>
        </div>

        <!-- My Blogs -->
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm border-0 summary-card" style="background: #267026; color: white;">
            <router-link to="/user/blogs" class="text-decoration-none text-white">
            <div class="card-body text-center" >
              <h5 class="card-title fw-bold">✍️ My Blogs</h5>
              <p class="display-6 fw-semibold mb-2 text-center">
                {{ summary.blogs }}
              </p>
                <span>View Blogs</span> <i class="bi bi-arrow-right float-end"></i>
            </div>
            </router-link>
          </div>
        </div>

        <!-- My Suggestions -->
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm border-0 summary-card" style="background: #267026; color: white;">
            <router-link to="/user/crop-suggestion" class="text-decoration-none text-white">
            <div class="card-body text-center" >
              <h5 class="card-title fw-bold">💡 My Suggestions</h5>
              <p class="display-6 fw-semibold mb-2 text-center">
                {{ summary.suggestions }}
              </p>
                <span>View Suggestions</span> <i class="bi bi-arrow-right float-end"></i>
            </div>
            </router-link>
          </div>
        </div>


      </div>
    </div>


</template>

<style scoped>
.summary-card {
  border-radius: 15px;
  transition: transform 0.2s ease-in-out;
}
.summary-card:hover {
  transform: translateY(-5px);
}
.card-title {
  font-size: 1.2rem;
}
</style>
