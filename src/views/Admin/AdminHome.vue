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
          <div class="card shadow-sm border-0 summary-card">
            <div class="card-body text-center">
              <h5 class="card-title text-primary fw-bold">🌱 Active Crops</h5>
              <p class="display-6 fw-semibold text-dark mb-2">
                {{ summary.activecrops }}
              </p>
              <router-link to="/admin/farm-projects" class="btn btn-outline-primary btn-sm">
                View Crops
              </router-link>
            </div>
          </div>
        </div>

        <!-- My Blogs -->
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm border-0 summary-card">
            <div class="card-body text-center">
              <h5 class="card-title text-success fw-bold">✍️ My Blogs</h5>
              <p class="display-6 fw-semibold text-dark mb-2">
                {{ summary.blogs }}
              </p>
              <router-link to="/admin/blogs" class="btn btn-outline-success btn-sm">
                View Blogs
              </router-link>
            </div>
          </div>
        </div>

        <!-- My Suggestions -->
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm border-0 summary-card">
            <div class="card-body text-center">
              <h5 class="card-title text-warning fw-bold">💡 My Suggestions</h5>
              <p class="display-6 fw-semibold text-dark mb-2">
                {{ summary.suggestions }}
              </p>
              <router-link to="/admin/crop-suggestion" class="btn btn-outline-warning btn-sm">
                View Suggestions
              </router-link>
            </div>
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
