<script setup>
import Navbar from "../components/Navbar.vue";
import { onMounted, ref, computed } from "vue";
import api from "../composables/axios.js";
import { storage_link } from "../composables/storage_link.js";
import Swal from "sweetalert2";
import Modal from "bootstrap/js/dist/modal";

const { storage_url } = storage_link()

const user = ref(null)

const form = ref({
  phone: '',
  location: '',
  privacy: 0,
  image: null
})

const isSaving = ref(false)

const fetchUser = async () => {

  try {

    const res = await api.get('/profile')

    user.value = res.data.user

    form.value.phone = user.value?.detail?.phone || ''
    form.value.location = user.value?.detail?.location || ''
    form.value.privacy = user.value?.detail?.privacy || 0

  } catch (err) {

    console.error('Failed to fetch user:', err)
  }
}

const profileImage = computed(() => {

  if (user.value?.detail?.image) {
    return storage_url + user.value.detail.image
  }

  return 'https://ui-avatars.com/api/?name=' + user.value?.name
})

const handleImageChange = (e) => {

  form.value.image = e.target.files[0]
}

const openEditModal = () => {

  const modalEl = document.getElementById('editProfileModal')

  const modal = Modal.getOrCreateInstance(modalEl)

  modal.show()
}

const updateProfile = async () => {

  isSaving.value = true

  try {

    const formData = new FormData()

    formData.append('phone', form.value.phone)
    formData.append('location', form.value.location)
    formData.append('privacy', form.value.privacy)

    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    await api.post('/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    await fetchUser()

    const modalEl = document.getElementById('editProfileModal')

    const modal = Modal.getOrCreateInstance(modalEl)

    modal.hide()

    Swal.fire({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your profile has been updated successfully!'
    })

  } catch (err) {

    console.error(err)

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update profile'
    })

  } finally {

    isSaving.value = false
  }
}

onMounted(() => {

  fetchUser()
})
</script>

<template>

  <Navbar />

  <div class="profile-page">


      <div class="container">

        <div class="profile-card shadow-lg">

          <!-- TOP -->
          <div class="top-section">

            <div class="profile-image-wrapper">

              <img
                  :src="profileImage"
                  class="profile-image"
                  alt="Profile"
              />

              <div class="online-badge"></div>

            </div>

            <h2 class="fw-bold mt-3 text-white">
              {{ user?.name }}
            </h2>

            <p class="text-light opacity-75">
              🌱 Farm Management Member
            </p>

          </div>

          <!-- CONTENT -->
          <div class="bottom-section">

            <div class="row g-4">

              <!-- Email -->
              <div class="col-md-6">

                <div class="info-card">

                  <div class="icon-box bg-primary-subtle">
                    <i class="bi bi-envelope-fill"></i>
                  </div>

                  <div>

                    <small class="text-muted">
                      Email Address
                    </small>

                    <h6 class="mb-0">
                      {{ user?.email || 'Not Provided' }}
                    </h6>

                  </div>

                </div>

              </div>

              <!-- Phone -->
              <div class="col-md-6">

                <div class="info-card">

                  <div class="icon-box bg-success-subtle">
                    <i class="bi bi-telephone-fill"></i>
                  </div>

                  <div>

                    <small class="text-muted">
                      Phone Number
                    </small>

                    <h6 class="mb-0">
                      {{ user?.detail?.phone || 'Not Provided' }}
                    </h6>

                  </div>

                </div>

              </div>

              <!-- Location -->
              <div class="col-md-6">

                <div class="info-card">

                  <div class="icon-box bg-warning-subtle">
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>

                  <div>

                    <small class="text-muted">
                      Location
                    </small>

                    <h6 class="mb-0">
                      {{ user?.detail?.location || 'Unknown Location' }}
                    </h6>

                  </div>

                </div>

              </div>

              <!-- Privacy -->
              <div class="col-md-6">

                <div class="info-card">

                  <div class="icon-box bg-danger-subtle">
                    <i class="bi bi-shield-lock-fill"></i>
                  </div>

                  <div>

                    <small class="text-muted">
                      Privacy
                    </small>

                    <h6 class="mb-0">
                      {{ user?.detail?.privacy === 1 ? 'Private' : 'Public' }}
                    </h6>

                  </div>

                </div>

              </div>

            </div>

            <!-- BUTTONS -->
            <div class="d-flex gap-3 mt-5 flex-wrap">

              <button
                  @click="openEditModal"
                  class="btn btn-success rounded-pill px-4 py-2"
              >
                <i class="bi bi-pencil-square me-2"></i>
                Edit Profile
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>


  <!-- EDIT MODAL -->
  <div
      class="modal fade"
      id="editProfileModal"
      tabindex="-1"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">

      <div class="modal-content border-0 rounded-4 overflow-hidden">

        <div class="modal-header bg-success text-white">

          <h5 class="modal-title fw-bold">
            Edit Profile
          </h5>

          <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
          ></button>

        </div>

        <form @submit.prevent="updateProfile">

          <div class="modal-body p-4">

            <!-- IMAGE -->
            <div class="text-center mb-4">

              <img
                  :src="profileImage"
                  class="edit-profile-image mb-3"
              />

              <input
                  type="file"
                  class="form-control"
                  @change="handleImageChange"
              />

            </div>

            <div class="row g-4">

              <!-- PHONE -->
              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  Phone Number
                </label>

                <input
                    type="text"
                    class="form-control form-control-lg"
                    v-model="form.phone"
                    placeholder="Enter phone number"
                />

              </div>

              <!-- LOCATION -->
              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  Location
                </label>

                <input
                    type="text"
                    class="form-control form-control-lg"
                    v-model="form.location"
                    placeholder="Enter location"
                />

              </div>

              <!-- PRIVACY -->
              <div class="col-12">

                <label class="form-label fw-semibold">
                  Privacy Setting
                </label>

                <select
                    v-model="form.privacy"
                    class="form-select form-select-lg"
                >
                  <option :value="0">
                    Public Profile
                  </option>

                  <option :value="1">
                    Private Profile
                  </option>

                </select>

              </div>

            </div>

          </div>

          <div class="modal-footer border-0 p-4">

            <button
                type="button"
                class="btn btn-light rounded-pill px-4"
                data-bs-dismiss="modal"
            >
              Cancel
            </button>

            <button
                type="submit"
                class="btn btn-success rounded-pill px-4"
                :disabled="isSaving"
            >

              <span
                  v-if="isSaving"
                  class="spinner-border spinner-border-sm me-2"
              ></span>

              {{ isSaving ? 'Saving...' : 'Save Changes' }}

            </button>

          </div>

        </form>

      </div>

    </div>
  </div>

</template>

<style scoped>

.profile-page {
  min-height: 100vh;
  background: #f4f7fb;
}

/* HERO */
.profile-hero {
  position: relative;
  min-height: 100vh;
  padding: 120px 15px 60px;
  background:
      linear-gradient(
          135deg,
          rgba(16, 185, 129, 0.9),
          rgba(5, 150, 105, 0.95)
      ),
      url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600');

  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(2px);
}

/* CARD */
.profile-card {
  position: relative;
  z-index: 2;
  max-width: 850px;
  margin: auto;
  border-radius: 30px;
  overflow: hidden;
  background: white;
}

/* TOP */
.top-section {
  padding: 60px 20px 40px;
  text-align: center;
  background:
      linear-gradient(
          135deg,
          #198754,
          #157347
      );
}

/* PROFILE IMAGE */
.profile-image-wrapper {
  position: relative;
  width: 140px;
  margin: auto;
}

.profile-image {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid white;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.edit-profile-image {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #198754;
}

.online-badge {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #22c55e;
  border: 3px solid white;
  position: absolute;
  right: 10px;
  bottom: 10px;
}

/* BOTTOM */
.bottom-section {
  padding: 40px;
}

/* INFO CARD */
.info-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f8fafc;
  border-radius: 18px;
  padding: 18px;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

/* ICONS */
.icon-box {
  width: 55px;
  height: 55px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

/* INPUTS */
.form-control,
.form-select {
  border-radius: 14px;
  border: 1px solid #dbe4ee;
  padding: 14px;
}

.form-control:focus,
.form-select:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25,135,84,.15);
}

/* RESPONSIVE */
@media(max-width: 768px){

  .bottom-section {
    padding: 25px;
  }

  .profile-image {
    width: 120px;
    height: 120px;
  }

  .profile-image-wrapper {
    width: 120px;
  }
}

</style>