
<script setup>
import { auth } from '../composables/auth'

import Navbar from "../components/Navbar.vue";
import {onMounted} from "vue";
import AdminDashboard from "./Admin/AdminDashboard.vue";
import GuestDashboard from "./Guest/GuestDashboard.vue";

const { user, isLoggedIn, AuthUser } = auth()

onMounted(() => {
  AuthUser()
})

</script>

<template>
    <Navbar />
<!--{{user}}-->
    <div v-if="isLoggedIn">
      <AdminDashboard v-if="user.role === 'admin'" />
      <GuestDashboard v-else-if="user.role === 'guest'" />
      <p v-else>Unknown role: {{ user.role }}</p>
    </div>

    <div v-else>
      <p>Loading user data...</p>
    </div>

</template>


<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
