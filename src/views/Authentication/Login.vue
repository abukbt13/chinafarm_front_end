
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import Navbar from "../../components/Navbar.vue";
import router from "../../router/index.js";
import api from "../../composables/axios.js";

const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    const res = await api.post('login', form.value);
    localStorage.setItem('token', res.data.token);
    Swal.fire('Success', 'Login successful', 'success');
    // redirect if needed
    await router.push('/admin')
  } catch (err) {
    Swal.fire('Error', err.response.data.message || 'Invalid credentials', 'error');
  }
};
</script>

<template>
  <Navbar />
  <div class="container mt-5 d-flex align-items-center justify-content-center">
    <div class="w-50">
      <h3 class="text-center">Login</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label>Email</label>
          <input type="email" v-model="form.email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label>Password</label>
          <input type="password" v-model="form.password" class="form-control" required />
        </div>
        <button class="btn btn-primary">Login</button>
      </form>
      <p class="text-center">Dont have an account <router-link to="/register">Register here</router-link></p>
    </div>
  </div>
</template>

