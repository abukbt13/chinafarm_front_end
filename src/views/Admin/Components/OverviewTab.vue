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
    farmingprogress.value = res.data.summary
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
 <div v-if="loading" class="text-center py-10 text-gray-500">
  <span class="animate-pulse">Loading farming season...</span>
</div>

  <div v-else-if="error" class="text-center py-10 text-red-500 font-semibold">
    {{ error }}
  </div>

  <div v-else class="space-y-6">
    <!-- Project Header -->
    <div class="bg-green-100 border-l-4 border-green-500 p-5 rounded-lg shadow-sm">
      <h3 class="text-2xl font-bold text-green-700 mb-2">
        🌱 {{ farmingprogress.project.name }}
      </h3>
      <p class="text-gray-600">{{ farmingprogress.project.description }}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <p><strong class="text-gray-700">📅 Start Date:</strong> {{ farmingprogress.project.start_date }}</p>
        <p><strong class="text-gray-700">📅 End Date:</strong> {{ farmingprogress.project.end_date }}</p>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-white shadow-md rounded-xl p-6 text-center border-t-4 border-red-400">
        <h4 class="text-lg font-semibold text-gray-700">💸 Total Expenses</h4>
        <p class="text-2xl font-bold text-red-500 mt-2">Ksh {{ farmingprogress.expense }}</p>
      </div>

      <div class="bg-white shadow-md rounded-xl p-6 text-center border-t-4 border-blue-400">
        <h4 class="text-lg font-semibold text-gray-700">💰 Total Returns</h4>
        <p class="text-2xl font-bold text-blue-500 mt-2">Ksh {{ farmingprogress.returns }}</p>
      </div>

      <div
          class="bg-white shadow-md rounded-xl p-6 text-center border-t-4"
          :class="farmingprogress.profit >= 0 ? 'border-green-400' : 'border-red-400'"
      >
        <h4 class="text-lg font-semibold text-gray-700">📊 Profit</h4>
        <p
            class="text-2xl font-bold mt-2"
            :class="farmingprogress.profit >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          Ksh {{ farmingprogress.profit }}
        </p>
      </div>
    </div>
  </div>
</template>
