<script setup>
import { ref, onMounted } from 'vue'
import api from "../../../composables/axios.js";
import {storage_link} from "../../../composables/storage_link.js";
const { storage_url } = storage_link()

const props = defineProps({
  seasonId: [String, Number]
})
const milestones = ref([])
const newMilestone = ref({
  activity: '',
  date: '',
  description: '',
  pictures: []
})

const fetchMilestones = async () => {
  try {
    const res = await api.get(`/milestone/show/${props.seasonId}`)
    milestones.value = res.data.milestones
  } catch (err) {
    console.error('Failed to fetch milestones:', err)
  }
}
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

const submitMilestone = async () => {
  const formData = new FormData()
  formData.append('activity', newMilestone.value.activity)
  formData.append('date', newMilestone.value.date)
  formData.append('description', newMilestone.value.description)
  newMilestone.value.pictures.forEach(file => {
    formData.append('pictures[]', file)
  })

  try {
    await api.post(`/milestone/${props.seasonId}`, formData)
    await fetchMilestones()
    document.getElementById('closeModalBtn')?.click()
    newMilestone.value = { date: '', description: '', pictures: [] }
  } catch (err) {
    console.error('Error submitting milestone:', err)
  }
}
onMounted( () => {
   fetchMilestones()
})
</script>

<template>
  <div>
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
          <img
              v-for="pic in milestone.pictures"
              :src="storage_url + pic"
              :key="pic"
              :alt="pic"
              class="img-thumbnail me-2"
              style="max-width: 150px;"
          />
          <div class=""  v-for="im in milestone.pictures">
            <ul>
              <li>{{ im }}</li>
            </ul>
          </div>
        </div>
        <h4>Date</h4>
        <strong>{{ milestone.date }}</strong>
      </li>
    </ul>

    <!-- Modal -->
    <div class="modal fade" id="addMilestoneModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="submitMilestone">
            <div class="modal-header">
              <h5 class="modal-title">Add Milestone</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" id="closeModalBtn" />
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Activity</label>
                <input v-model="newMilestone.activity" type="text" placeholder="enter activity like Weeding" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="newMilestone.description" class="form-control" rows="3" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Pictures</label>
                <input type="file" class="form-control" multiple @change="e => newMilestone.pictures = Array.from(e.target.files)" />
              </div>
              <div class="mb-3">
                <label class="form-label">Date</label>
                <input v-model="newMilestone.date" type="date" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-success">Save Milestone</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
