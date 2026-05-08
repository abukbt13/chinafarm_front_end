<script setup>
import { ref, onMounted, watch } from 'vue'
import api from "../../composables/axios.js"
import { auth } from "../../composables/auth.js"
import Modal from "bootstrap/js/dist/modal"

const { user, isLoggedIn, AuthUser } = auth()

const plans = ref([])

// Form states
const crop = ref('')
const startDate = ref('')
const endDate = ref('')
const period = ref('')
const description = ref('')
const success = ref(false)
const errors = ref({})

// Edit states
const isEditing = ref(false)
const editId = ref(null)

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'

  const date = new Date(dateStr)

  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const FetchFarmingProgress = async () => {
  try {
    const res = await api.get('farming-projects')
    plans.value = res.data.crops
  } catch (err) {
    console.error('Failed to fetch crops:', err)
  }
}

watch([startDate, period], ([newStart, newPeriod]) => {
  if (newStart && newPeriod) {
    const start = new Date(`${newStart}T00:00:00`)

    if (!isNaN(start.getTime())) {
      const newEnd = new Date(start)

      newEnd.setDate(newEnd.getDate() + parseInt(newPeriod))

      endDate.value = newEnd.toISOString().slice(0, 10)
    }
  }
})

const clearForm = () => {
  crop.value = ''
  startDate.value = ''
  endDate.value = ''
  period.value = ''
  description.value = ''

  success.value = false
  errors.value = {}

  isEditing.value = false
  editId.value = null
}

const EditProject = (item) => {
  isEditing.value = true
  editId.value = item.id

  crop.value = item.crop
  startDate.value = item.start_date
  endDate.value = item.end_date
  period.value = item.period
  description.value = item.description

  const modalEl = document.getElementById('exampleModal')
  const modal = new Modal(modalEl)
  modal.show()
}

const saveCrop = async () => {
  success.value = false
  errors.value = {}

  const parseDate = (d) => {
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      return new Date(`${d}T00:00:00`)
    }

    return new Date(d)
  }

  const start = parseDate(startDate.value)
  const end = parseDate(endDate.value)

  if (end.getTime() <= start.getTime()) {
    errors.value.end_date = 'End date should be greater than start date'
    return
  }

  const minEndDate = new Date(start)
  minEndDate.setMonth(minEndDate.getMonth() + 1)

  if (end.getTime() < minEndDate.getTime()) {
    errors.value.end_date = 'End date should be at least one month after start date'
    return
  }

  try {
    const payload = {
      period: period.value,
      crop: crop.value,
      start_date: startDate.value,
      end_date: endDate.value || null,
      description: description.value
    }

    let response

    if (isEditing.value) {
      response = await api.post(`farming-projects/update/${editId.value}`, payload)
    } else {
      response = await api.post('farming-projects', payload)
    }

    if (response.status === 201 || response.status === 200) {

      success.value = true

      const modalEl = document.getElementById('exampleModal')

      const modal = Modal.getOrCreateInstance(modalEl)

      modal.hide()
      document.body.classList.remove('modal-open')

      const backdrops = document.getElementsByClassName('modal-backdrop')

      while (backdrops.length > 0) {
        backdrops[0].parentNode.removeChild(backdrops[0])
      }
      // wait for modal animation to finish
      setTimeout(async () => {

        clearForm()

        await FetchFarmingProgress()

      }, 300)
    }
  } catch (err) {

    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    } else {
      console.error(err)
    }
  }
}

onMounted(() => {
  AuthUser()
  FetchFarmingProgress()
})
</script>

<template>
  <div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">🌾 My Farm Projects</h3>

      <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          @click="clearForm"
      >
        ➕ New Project
      </button>
    </div>

    <div class="row row-cols-1 row-cols-md-3 g-4">

      <div class="col" v-for="item in plans" :key="item.id">

        <router-link
            :to="'/user/project-progress/' + item.id"
            class="card text-decoration-none shadow-sm h-100"
        >

          <div
              class="card-body position-relative"
              :class="{
                'bg-primary': item.status === 'completed',
                'bg-danger': item.status === 'overdue',
                'bg-warning text-dark': item.status === 'pending'
              }"
              :style="{
                backgroundColor: item.status === 'active' ? '#ddd' : ''
              }"
          >

            <!-- Edit Button -->
            <button
                class="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
                @click.prevent="EditProject(item)"
            >
              <i class="bi bi-pencil-square"></i>
            </button>

            <i
                class="bi bi-arrow-right-circle float-end"
                style="font-size: 2rem;"
            ></i>

            <h5 class="card-title">{{ item.crop }}</h5>

            <p>{{ item.description }}</p>

            <p class="card-text">
              Planted on: {{ formatDate(item.start_date) }} <br>

              Estimated harvest:
              {{ item.end_date ? formatDate(item.end_date) : 'N/A' }}
            </p>

            <div class="border w-100 text-uppercase text-center">
              {{ item.status }}
            </div>

          </div>

        </router-link>

      </div>

    </div>

    <!-- Modal -->
    <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >

      <div class="modal-dialog">

        <div class="modal-content">

          <div class="modal-header">

            <h1 class="modal-title fs-5" id="exampleModalLabel">
              {{ isEditing ? '✏️ Edit Project' : '🌱 Add Planting Plan' }}
            </h1>

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            ></button>

          </div>

          <div class="modal-body">

            <form @submit.prevent="saveCrop">

              <div class="mb-3">
                <label class="form-label">Crop Name</label>

                <input
                    type="text"
                    class="form-control"
                    v-model="crop"
                />

                <small class="text-danger" v-if="errors.crop">
                  {{ errors.crop[0] }}
                </small>
              </div>

              <div class="mb-3">
                <label class="form-label">Start Date</label>

                <input
                    type="date"
                    class="form-control"
                    v-model="startDate"
                />

                <small class="text-danger" v-if="errors.start_date">
                  {{ errors.start_date[0] }}
                </small>
              </div>

              <div class="mb-3">
                <label class="form-label">End Date (Optional)</label>

                <input
                    type="date"
                    class="form-control"
                    v-model="endDate"
                />

                <p class="text-danger" v-if="errors.end_date">
                  {{ errors.end_date }}
                </p>
              </div>

              <div class="mb-3">
                <label class="form-label">
                  Maturity period in day (Optional)
                </label>

                <input
                    type="number"
                    class="form-control"
                    v-model="period"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>

                <textarea
                    class="form-control"
                    rows="3"
                    v-model="description"
                ></textarea>

                <small class="text-danger" v-if="errors.description">
                  {{ errors.description[0] }}
                </small>
              </div>

              <!-- Success Message -->
              <div
                  v-if="success"
                  class="alert alert-info alert-dismissible fade show d-flex justify-content-between align-items-center"
                  role="alert"
              >
                <div>
                  <i class="bi bi-check-circle-fill me-2"></i>

                  <strong>
                    {{
                      isEditing
                          ? 'Project updated successfully!'
                          : 'Crop added successfully!'
                    }}
                  </strong>
                </div>

                <button
                    data-bs-dismiss="modal"
                    type="button"
                    class="btn-close"
                    @click="success = false"
                    aria-label="Close"
                ></button>
              </div>

              <!-- Submit Button -->
              <button
                  v-else
                  type="submit"
                  class="btn btn-success w-100"
              >
                {{ isEditing ? 'Update Project' : 'Save Crop' }}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>