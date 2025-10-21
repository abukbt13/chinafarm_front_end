
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
    const { token, user } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    Swal.fire('Success', 'Login successful', 'success');

    if (user.role === 'admin') {
      await router.push('/admin');
    } else if (user.role === 'farmer') {
      await router.push('/user');
    } else {
      await router.push('/dashboard');
    }
  } catch (err) {
    await  Swal.fire('Error', err.response?.data?.message || 'Invalid credentials', 'error');
  }
};

</script>

<template>
  <Navbar />
  <div class="container mt-5 d-flex align-items-center justify-content-center">
    <div class="col-12 col-md-8 col-lg-8 col-xl-4 card shadow-lg p-4">
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

