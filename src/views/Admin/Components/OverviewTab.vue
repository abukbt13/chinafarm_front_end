<script setup>
import { ref, onMounted } from 'vue'
import api from "../../../composables/axios.js";

const props = defineProps({
  season_id: {
    type: [Number, String],
    required: true
  }
})

const farmingprogress = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchFarmingSeason = async () => {
  try {
    const res = await api.get(`/farming-projects/${props.season_id}`)
    farmingprogress.value = res.data.farming_progress
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load farming season.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFarmingSeason()
})
</script>

<template>
  <div v-if="loading">Loading farming season...</div>
  <div v-else-if="error" class="text-danger">{{ error }}</div>
  <div v-else>
    <h3 class="text-xl font-semibold">{{ farmingprogress.name }}</h3>
    <p><strong>Description:</strong> {{ farmingprogress.description }}</p>
    <p><strong>Start Date:</strong> {{ farmingprogress.start_date }}</p>
    <p><strong>End Date:</strong> {{ farmingprogress.end_date }}</p>
  </div>
</template>
