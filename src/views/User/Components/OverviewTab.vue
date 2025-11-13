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
async function updateStatus(newStatus) {
  try {
    const res = await api.post('/farming-projects/'+props.season_id+'/status', {
      status: newStatus
    })

    projectStatus.value = newStatus // update reactive status immediately

    Swal.fire({
      title: 'Success',
      text: res.data.message || `Project status updated to ${newStatus}`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (err) {
    Swal.fire({
      title: 'Error',
      text: err.response?.data?.message || 'Failed to update status',
      icon: 'error'
    })
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
     <div class="">
       <div class="float-end p-4" data-bs-toggle="modal" data-bs-target="#changeStatus">
         <button @click="updateStatus('closed')" v-if="farmingprogress.project.status === 'active'" class="btn m-1 btn-danger">
           Close Project
         </button>
         <button @click="updateStatus('active')" v-else class="btn m-1 btn-success">
           Reopen Project
         </button>
         <button @click="updateStatus('pending')" class="btn btn-danger m-1 btn-success">
           Suspend Project
         </button>
       </div>
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

</template>
