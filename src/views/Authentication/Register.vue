
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
    if(res.data.user.role === 'admin'){
      await router.push('/admin')
    }
    else {
      await router.push('/guest')
    }
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
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-success text-white text-center">
            <h4>Register</h4>
          </div>
          <div class="card-body">
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
          </div>
          <p class="text-center">Already have an account <router-link to="/login">Login here</router-link></p>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 0.75rem;
}
</style>
