<script setup lang="ts">
// Example user data (later can come from API or props)
import Navbar from "../../components/Navbar.vue";
import api from "../../composables/axios";
import {onMounted, ref} from "vue";
const user = ref([])
const fetcUser = async () => {
  try {
    const res = await api.get('/profile')
    user.value = res.data
  } catch (err) {
    console.error('Failed to fetch milestones:', err)
  }
}
onMounted( () => {
  fetcUser()
})
</script>

<template>
  <Navbar />
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card shadow-lg border-0 rounded-4" style="max-width: 420px; width: 100%;">
      <div class="card-body text-center p-4">
        <!-- Profile Image -->
        <div class="profile-img-wrapper mb-3">
          <img :src="user.profilePicture" alt="Profile Picture" class="profile-img" />
        </div>

        <!-- User Info -->
        <h4 class="fw-bold text-dark mb-2">{{ user.name }}</h4>
        <p class="text-muted small mb-4">User Profile</p>

        <div class="text-start px-3">
          <p class="mb-3">
            <i class="bi bi-envelope-fill text-primary me-2"></i>
            <strong>Email:</strong> {{ user.email }}
          </p>
          <p class="mb-0">
            <i class="bi bi-telephone-fill text-success me-2"></i>
            <strong>Phone:</strong> {{ user.phone }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-img-wrapper {
  display: flex;
  justify-content: center;
}
.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}
</style>
