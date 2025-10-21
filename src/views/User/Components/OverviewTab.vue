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
    <div class="border shadow-lg m-2">
      <h1 class="text-center">Project Information</h1>
      <h2 class="text-center">Project Status</h2>
      <h3
          class="text-center"
          :class="{
    'text-warning': farmingprogress.project.status === 'pending',
    'text-success': farmingprogress.project.status === 'active',
    'text-danger': farmingprogress.project.status === 'closed'
  }"
      >
        {{ farmingprogress.project.status }}
      </h3>

      <div class="d-flex flex-column flex-lg-row">

        <div class=" w-100 p-4 m-2 ">
          <h2>Farm Project</h2>
          <p>{{ farmingprogress.project.crop }}</p>
          <div v-if="farmingprogress.project.description" class="">
            <h2>Description</h2>
            <p class="text-gray-600">{{ farmingprogress.project.description }}</p>
          </div>
        </div>
        <div class="w-100 p-4 m-2">
          <h2>Start Date</h2>
          <p>{{ farmingprogress.project.start_date }}</p>

          <h2>End Date</h2>
          <p>{{ farmingprogress.project.end_date }}</p>
        </div>



      </div>
    </div>

    <div class="border shadow-lg m-2">
      <h3 class="text-center">Financial Summary</h3>
      <div class="d-flex flex-column flex-lg-row">
        <div class="border w-100 p-4 m-2">
          <h3>💸 Total Expenses</h3>
          <p>Ksh {{ farmingprogress.expense }}</p>
          <div  class="">
            <h2>Returns</h2>
            <p class="text-gray-600">Ksh {{ farmingprogress.returns }}</p>
          </div>
        </div>
        <div class="border w-100 p-4 m-2">
          <h3>📊 Profit</h3>
          <div v-if="farmingprogress.project.description" class="">
            <p class="text-gray-600">Ksh {{ farmingprogress.profit }}</p>
          </div>
      </div>
        </div>
      </div>
    </div>

</template>
