<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import api from '../../composables/axios.js'
import {storage_link} from "../../composables/storage_link.js";
const {storage_url} =storage_link()
const route = useRoute()

const farmingSeason = ref(null)
const loading = ref(true)
const error = ref(null)

const milestones = ref([])
const newMilestone = ref({
  date: '',
  description: '',
  pictures: []
})

// Fetch farming season
const fetchFarmingPlant = async () => {
  try {
    const res = await api.get(`/farming-season/${route.params.id}`)
    farmingSeason.value = res.data.farming_season
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load farming season.'
  } finally {
    loading.value = false
  }
}

// Fetch milestones
const fetchMilestones = async () => {
  try {
    const res = await api.get('/milestone/show/' + route.params.id) // Adjust if needed
    milestones.value = res.data.milestones
  } catch (err) {
    console.error(err)
  }
}

// Submit new milestone
const submitMilestone = async () => {
  const formData = new FormData()
  formData.append('date', newMilestone.value.date)
  formData.append('description', newMilestone.value.description)
  newMilestone.value.pictures.forEach(file => {
    formData.append('pictures[]', file)
  })
  // formData.append('season_id', route.params.id) // if using FK

  try {
    await api.post('/milestone/'+route.params.id, formData)
    await fetchMilestones()
    document.getElementById('closeModalBtn')?.click()
    newMilestone.value = { date: '', description: '', pictures: [] }
  } catch (err) {
    console.error('Error submitting milestone:', err)
  }
}

onMounted(() => {
  fetchFarmingPlant()
  fetchMilestones()
})
</script>

<template>
  <!-- buttons -->
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview-tab-pane" type="button" role="tab" aria-controls="overview-tab-pane" aria-selected="true">Overview</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="Progresses-tab" data-bs-toggle="tab" data-bs-target="#Progresses-tab-pane" type="button" role="tab" aria-controls="Progresses-tab-pane" aria-selected="false">Progresses</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="expense-tab" data-bs-toggle="tab" data-bs-target="#expense-tab-pane" type="button" role="tab" aria-controls="expense-tab-pane" aria-selected="false">Expenses</button>
    </li>
  </ul>

  <!-- triggered contents -->
  <div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active p-3" id="overview-tab-pane" role="tabpanel" aria-labelledby="overview-tab" tabindex="0">
      <div v-if="loading">Loading farming season...</div>
      <div v-else-if="error" class="text-danger">{{ error }}</div>
      <div v-else>
        <h3>{{ farmingSeason.name }}</h3>
        <p><strong>Description:</strong> {{ farmingSeason.description }}</p>
        <p><strong>Start Date:</strong> {{ farmingSeason.start_date }}</p>
        <p><strong>End Date:</strong> {{ farmingSeason.end_date }}</p>
      </div>
    </div>

    <div class="tab-pane fade p-3" id="Progresses-tab-pane" role="tabpanel" aria-labelledby="Progresses-tab" tabindex="0">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Progress Milestones</h4>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMilestoneModal">
          Add Milestone
        </button>
      </div>

      <div v-if="milestones.length === 0" class="text-muted">
        <h2>No milestone found!</h2>
      </div>
      <ul v-else class="list-group">
        <li v-for="milestone in milestones" :key="milestone.id" class="list-group-item">
         <h2>Description</h2>
          <p>{{ milestone.description }}</p>

          <div class="mt-2">
            <img v-for="pic in milestone.pictures" :src="storage_url+pic" :key="pic" :alt="pic"
                 class="img-thumbnail me-2" style="max-width: 150px;" />{{pic}}
          </div>
          <h4>Date</h4>
          <strong>{{ milestone.date }}</strong>:
        </li>
      </ul>

    </div>

    <div class="tab-pane fade p-3" id="expense-tab-pane" role="tabpanel" aria-labelledby="expense-tab" tabindex="0">
      <h2>Expenses tab</h2>
    </div>
  </div>

  <!-- Milestone Modal -->
  <div class="modal fade" id="addMilestoneModal" tabindex="-1" aria-labelledby="addMilestoneModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Milestone</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalBtn"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitMilestone">
            <div class="mb-3">
              <label for="date" class="form-label">Date</label>
              <input v-model="newMilestone.date" type="date" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea v-model="newMilestone.description" class="form-control" rows="3" required></textarea>
            </div>
            <div class="mb-3">
              <label for="pictures" class="form-label">Pictures</label>
              <input type="file" class="form-control" multiple @change="e => newMilestone.pictures = Array.from(e.target.files)" />
            </div>
            <button type="submit" class="btn btn-success">Save Milestone</button>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>
