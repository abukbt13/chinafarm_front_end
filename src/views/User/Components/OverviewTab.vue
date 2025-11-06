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

const projectStatus = ref('')

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
function setStatus(data){
   projectStatus.value = data
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
     <div class="">
       <i class="bi bi-three-dots-vertical float-end p-4" @click="setStatus(farmingprogress.project.status)" data-bs-toggle="modal" data-bs-target="#changeStatus"></i>
       <h1  class="text-center text-primary">Project Information</h1>
       <h2 class="text-center">Status:   <span
           class="text-center"
           :class="{
            'text-warning': farmingprogress.project.status === 'pending',
            'text-success': farmingprogress.project.status === 'active',
            'text-danger': farmingprogress.project.status === 'closed'
          }"
       >
        {{ farmingprogress.project.status }}
      </span></h2>
     </div>


      <div class="d-flex flex-column flex-lg-row">

        <div class="text-center w-100 p-4 m-2 ">
          <h4>Project Name</h4>
          <p>{{ farmingprogress.project.crop }}</p>
          <div v-if="farmingprogress.project.description" class="">
            <h5>Description</h5>
            <p class="text-gray-600">{{ farmingprogress.project.description }}</p>
          </div>
        </div>
        <div class="text-center w-100 p-4 m-2">
          <h4>Start Date</h4>
          <p>{{ farmingprogress.project.start_date }}</p>

          <h5>End Date</h5>
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
  <!-- Change Project Status Modal -->
  <div
      class="modal fade"
      id="changeStatus"
      tabindex="-1"
      aria-labelledby="changeStatusLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg rounded-3">

        <!-- Modal Header -->
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="changeStatusLabel">Change Project Status</h5>
          <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body text-center">
          <label for="statusSelect" class="form-label fw-bold mb-2">Select New Status</label>

          <select
              id="statusSelect"
              v-model="newStatus"
              class="form-select text-capitalize"
          >
            <option disabled value="">-- Choose status --</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>

          <p class="mt-3 text-muted">
            Current Status: <span class="fw-semibold text-capitalize">{{ projectStatus }}</span>
          </p>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
              type="button"
              class="btn btn-primary"
              @click="saveStatusChange"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  </div>

</template>
