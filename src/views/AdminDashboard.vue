<script setup>
import { ref, onMounted } from "vue";
import api from "../composables/axios.js";
import { storage_link } from "../composables/storage_link.js";
import Navbar from "../components/Navbar.vue";
import {auth} from "../composables/auth.js";
import router from "../router/index.js";
import alert from "bootstrap/js/src/alert.js";

const { storage_url } = storage_link()

const users = ref([])
const { user, isLoggedIn,AuthUser} = auth()

const fetchUsers = async () => {

  try {

    const res = await api.get('/users')

    users.value = res.data.users

  } catch (err) {

    console.error(err)
  }
}

const profileImage = (user) => {

  if (user?.detail?.image) {
    return storage_url + user.detail.image
  }

  return `https://ui-avatars.com/api/?name=${user.name}`
}

onMounted(() => {

  AuthUser()
  fetchUsers()
})
</script>

<template>

  <navbar />
  <div class="container py-5">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">

      <div>
        <h2 class="fw-bold text-success mb-1">
          👥 Users Management
        </h2>

        <p class="text-muted mb-0">
          View all registered users and their profile details
        </p>
      </div>

      <div class="badge bg-success fs-6 px-3 py-2 rounded-pill">
        Total Users: {{ users.length }}
      </div>

    </div>

    <!-- Table Card -->
    <div class="card border-0 shadow-lg rounded-4 overflow-hidden">

      <div class="table-responsive">

        <table class="table align-middle mb-0 custom-table">

          <thead>

          <tr>
            <th>#</th>
            <th>User</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Privacy</th>
            <th>Joined</th>
          </tr>

          </thead>

          <tbody>

          <tr
              v-for="(user, index) in users"
              :key="user.id"
          >

            <!-- Number -->
            <td class="fw-bold text-muted">
              {{ index + 1 }}
            </td>

            <!-- Profile -->
            <td>

              <div class="d-flex align-items-center gap-3">

                <img
                    :src="profileImage(user)"
                    class="profile-img"
                    alt="Profile"
                />

                <div>

                  <h6 class="mb-0 fw-bold">
                    {{ user.name }}
                  </h6>

                  <small class="text-muted">
                    ID: {{ user.id }}
                  </small>

                </div>

              </div>

            </td>

            <!-- Email -->
            <td>
              <span class="text-dark">
                {{ user.email }}
              </span>
            </td>

            <!-- Phone -->
            <td>

              <span
                  v-if="user.detail?.phone"
                  class="badge bg-light text-dark border px-3 py-2"
              >
                {{ user.detail.phone }}
              </span>

              <span
                  v-else
                  class="text-muted"
              >
                Not Provided
              </span>

            </td>

            <!-- Location -->
            <td>

              <span
                  v-if="user.detail?.location"
                  class="location-pill"
              >
                📍 {{ user.detail.location }}
              </span>

              <span
                  v-else
                  class="text-muted"
              >
                Unknown
              </span>

            </td>

            <!-- Privacy -->
            <td>

              <span
                  v-if="user.detail?.privacy === 1"
                  class="badge bg-danger-subtle text-danger px-3 py-2"
              >
                Private
              </span>

              <span
                  v-else
                  class="badge bg-success-subtle text-success px-3 py-2"
              >
                Public
              </span>

            </td>

            <!-- Joined -->
            <td>

              <small class="text-muted">
                {{ new Date(user.created_at).toLocaleDateString() }}
              </small>

            </td>

          </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>

</template>

<style scoped>

.custom-table thead {
  background: linear-gradient(
      135deg,
      #198754,
      #157347
  );
  color: white;
}

.custom-table thead th {
  padding: 18px;
  border: none;
  font-weight: 600;
  white-space: nowrap;
}

.custom-table tbody tr {
  transition: all 0.25s ease;
}

.custom-table tbody tr:hover {
  background: #f8fafc;
  transform: scale(1.002);
}

.custom-table td {
  padding: 18px;
  vertical-align: middle;
}

/* Profile Image */
.profile-img {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #198754;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* Location */
.location-pill {
  background: #f1f5f9;
  padding: 7px 14px;
  border-radius: 30px;
  font-size: 0.85rem;
  display: inline-block;
}

/* Mobile */
@media(max-width: 768px){

  .custom-table td,
  .custom-table th {
    padding: 12px;
    font-size: 0.9rem;
  }

  .profile-img {
    width: 45px;
    height: 45px;
  }
}

</style>