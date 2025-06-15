<script setup>
import { ref } from 'vue'

const isCollapsed = ref(true)
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #267026;">
    <div class="container-fluid">
      <!-- Logo / Brand -->
      <a class="navbar-brand fw-bold" href="#">🌱 CHINA FARM</a>

      <!-- Toggle Button for Mobile -->
      <button
          class="navbar-toggler"
          type="button"
          @click="isCollapsed = !isCollapsed"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Links -->
      <div class="collapse navbar-collapse" :class="{ show: !isCollapsed }">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 text-uppercase">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/crops" class="nav-link">Crops</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/education" class="nav-link">Education</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/videos" class="nav-link">Videos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link">Contact</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-nav .nav-link:hover {
  text-decoration: underline;
  background-color: #215e21;
  border-radius: 4px;
}
</style>
