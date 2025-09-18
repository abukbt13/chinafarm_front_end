
<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import axios from "axios";
import Navbar from "../../components/Navbar.vue";
import api from "../../composables/axios.js";

const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const submit = async () => {
  try {
    const res = await api.post('register', form.value);
    localStorage.setItem('token', res.data.token);

    Swal.fire({
      icon: 'success',
      title: 'Registered successfully',
      timer: 1500,
      showConfirmButton: false,
    });
      await router.push('/admin')

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: error.res?.data?.message || 'Something went wrong',
    });
  }
};
</script>

<template>
  <Navbar />
  <div class="container mt-5 d-flex align-items-center justify-content-center">
    <div class="col-12 col-md-8 col-lg-8 col-xl-4 card shadow-lg p-4">
      <h3 class="text-center mb-4">Register</h3>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label for="name" class="form-label">Full Name</label>
          <input
              v-model="form.name"
              type="text"
              class="form-control"
              id="name"
              required
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="email"
              required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="password"
              required
          />
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
              v-model="form.password_confirmation"
              type="password"
              class="form-control"
              id="confirmPassword"
              required
          />
        </div>

        <button type="submit" class="btn btn-success w-100">Register</button>
      </form>

      <p class="text-center mt-3">
        Already have an account?
        <router-link to="/login" class="fw-semibold text-success text-decoration-none">
          Login here
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 0.75rem;
}
</style>
