<script setup>
import { ref, onMounted } from 'vue'

import axios from 'axios'
import router from '../router'
const isCollapsed = ref(true)
const isLoggedIn = ref(false)

onMounted(() => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
})

const toggleNav = () => {
  isCollapsed.value = !isCollapsed.value
}

 const logout = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return router.push({ name: 'login' })
  }

  try {
    await axios.post('http://127.0.0.1:8000/api/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    localStorage.removeItem('token')
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout failed', error)
    // Still remove token on failure
    localStorage.removeItem('token')
    await router.push({name: 'login'})
  }
}

</script>

<template>
  <nav class="navbar">
    <div class="container">
      <!-- Logo -->
      <a href="/" class="logo">🌱 CHINA FARM</a>

      <!-- Hamburger -->
      <button class="menu-btn" @click="toggleNav">
        <span v-if="isCollapsed">☰</span>
        <span v-else>✕</span>
      </button>

      <!-- Links -->
      <div class="nav-links" :class="{ open: !isCollapsed }">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/crops">Crops</router-link></li>
          <li><router-link to="/education">Education</router-link></li>
          <li><router-link to="/videos">Videos</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>

        <!-- Auth Section -->
        <div class="auth-section">
          <template v-if="isLoggedIn">
            <!-- User dropdown -->
            <div class="user-icon">
              <i class="bi bi-person-circle fs-4"></i>
              <div class="dropdown">
                <router-link to="/dashboard">Dashboard</router-link>
                <a @click.prevent="logout" class="dropdown-item" href="#">Logout</a>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="login-btn">Sign In</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #267026;
  color: white;
  padding: 0.8rem 1rem;
  position: relative;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  text-decoration: none;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  display: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links ul {
  display: flex;
  list-style: none;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.nav-links li a {
  text-decoration: none;
  color: white;
  font-weight: 500;
}

.nav-links li a:hover {
  text-decoration: underline;
}

.auth-section {
  margin-left: 1rem;
}

.login-btn {
  background-color: white;
  color: #267026;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}

.user-icon {
  position: relative;
  cursor: pointer;
}

.user-icon .dropdown {
  position: absolute;
  top: 30px;
  right: 0;
  background: white;
  color: black;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  display: none;
}

.user-icon:hover .dropdown {
  display: flex;
}

.user-icon .dropdown a {
  padding: 0.5rem;
  text-decoration: none;
  color: #267026;
}

.user-icon .dropdown a:hover {
  background-color: #e0f0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-btn {
    display: block;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
    display: none;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links ul {
    flex-direction: column;
    width: 100%;
  }

  .nav-links li {
    padding: 0.5rem 0;
    text-align: center;
  }

  .auth-section {
    margin-top: 1rem;
    text-align: center;
  }
}
</style>
