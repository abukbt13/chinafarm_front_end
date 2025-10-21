<script setup>
import {ref, onMounted, watch} from 'vue'
import api from "../../composables/axios.js"
import { auth } from "../../composables/auth.js"
import Modal from "bootstrap/js/dist/modal" // ✅ Correct Bootstrap Modal class

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

// Store modal instanc
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const FetchFarmingProgress =async ()=>{
  try {
    const res = await api.get('farming-projects') // Adjust the endpoint if needed
    plans.value = res.data.crops // Laravel API Resource format

  } catch (err) {
    console.error('Failed to fetch crops:', err)
  }
}

watch([startDate, period], ([newStart, newPeriod]) => {
  if (newStart && newPeriod) {
    const start = new Date(`${newStart}T00:00:00`) // ensure safe parse
    if (!isNaN(start.getTime())) {
      const newEnd = new Date(start)
      newEnd.setDate(newEnd.getDate() + parseInt(newPeriod)) // add days
      endDate.value = newEnd.toISOString().slice(0, 10) // format YYYY-MM-DD
    }
  }
})


const saveCrop = async () => {
  success.value = false
  const parseDate = (d) => {
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      // force local midnight to avoid timezone shifts
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

  // Option: if you prefer "at least 30 days" instead of one calendar month, use:
  // const minEndDate = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000)

  if (end.getTime() < minEndDate.getTime()) {
    errors.value.end_date = 'End date should be at least one month after start date'
    return
  }

  try {
    const response = await api.post('farming-projects', {
      period: period.value,
      crop: crop.value,
      start_date: startDate.value,
      end_date: endDate.value || null,
      description: description.value
    })

    if (response.status === 201 || response.status === 200) {
      success.value = true
      // Clear form
      crop.value = ''
      startDate.value = ''
      endDate.value = ''
      description.value = ''
     await FetchFarmingProgress()
    }
  } catch (err) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    } else {
      console.error(err)
    }

}}

onMounted(() => {
  AuthUser()
  FetchFarmingProgress()
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">🌾 My Farm Projects</h3>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        ➕ New Project
      </button>
    </div>

    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="item in plans" :key="item">
        <router-link cla :to="'/user/project-progress/' + item.id"  class="card text-decoration-none bg-pr shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ item.crop }}</h5>
              <p>{{item.description}}</p>
            <p class="card-text">
              Planted on: {{ formatDate(item.start_date) }}<br>
              Estimated harvest: {{ item.end_date ? formatDate(item.end_date) : 'N/A' }}
            </p>
            <span class="badge bg-success">Growing</span>
          </div>
        </router-link>
      </div>
    </div>


    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">🌱 Add Planting Plan</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCrop">
              <div class="mb-3">
                <label class="form-label">Crop Name</label>
                <input type="text" class="form-control" v-model="crop" />
                <small class="text-danger" v-if="errors.crop">{{ errors.crop[0] }}</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control" v-model="startDate" />
                <small class="text-danger" v-if="errors.start_date">{{ errors.start_date[0] }}</small>
              </div>

              <div class="mb-3">
                <label class="form-label">End Date (Optional)</label>
                <input type="date" class="form-control" v-model="endDate" />
                <p class="text-danger" v-if="errors.end_date">{{ errors.end_date }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label">Maturity period in day (Optional)</label>
                <input type="number" class="form-control" v-model="period" />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="3" v-model="description"></textarea>
                <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
              </div>
              <!-- Success Message UI -->
              <div
                  v-if="success"
                  class="alert alert-info alert-dismissible fade show d-flex justify-content-between align-items-center"
                  role="alert"
              >
                <div>
                  <i class="bi bi-check-circle-fill me-2"></i>
                  <strong>Crop added successfully!</strong>
                </div>
                <button data-bs-dismiss="modal"
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
                Save Crop
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
