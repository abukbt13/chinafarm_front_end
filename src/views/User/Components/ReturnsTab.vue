<script setup>
import { ref, onMounted } from 'vue'
import api from "../../../composables/axios.js";

const props = defineProps({
  seasonId: {
    type: [Number, String],
    required: true
  }
})

const returnItems = ref([])
const newReturn = ref({ name: '', description: '', date: '' ,amount:'' })
const editReturn = ref(null)
const loading = ref(true)

const fetchReturns = async () => {
  try {
    const res = await api.get(`project_returns/${props.seasonId}`)
    returnItems.value = res.data.project_returns
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const submitReturn = async () => {
  try {
    await api.post('project_returns/' + props.seasonId, { ...newReturn.value, farm_project_id: props.seasonId })
    newReturn.value = { name: '', description: '', date: '' ,amount: '' }
    await fetchReturns()
  } catch (err) {
    console.error(err)
  }
}

const startEdit = (item) => {
  editReturn.value = { ...item }
}

const updateReturn = async () => {
  try {
    await api.post('project_returns/update/' + props.seasonId + '/' + editReturn.value.id, editReturn.value)
    editReturn.value = null
    await fetchReturns()
  } catch (err) {
    console.error(err)
  }
}

const deleteReturn = async (id) => {
  if (confirm('Are you sure you want to delete this return item?')) {
    try {
      await api.delete('project_returns/delete/'+props.seasonId +'/' +id)
      await fetchReturns()
    } catch (err) {
      console.error(err)
    }
  }
}

onMounted(() => {
  fetchReturns()
})
</script>

<template>
  <div class="p-3">
    <h4 class="my-4">
      Crop returns
      <button class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#return">Add Return</button>
    </h4>

    <!-- New Return Modal -->
    <div class="modal fade" id="return" tabindex="-1" aria-labelledby="return" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="return">New Return</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitReturn" class="mb-4">
              <div class="mb-3">
                <label for="returnName" class="form-label">Type of sale(what did you sale)</label>
                <select
                    v-model="newReturn.name"
                    class="form-control"
                    id="returnName"
                    required
                >
                  <option value="">-- Select Return Type --</option>
                  <option value="Produce Sale">Produce Sale</option>
                  <option value="Seedling Sale">Seedling Sale</option>
                </select>

              </div>

              <div class="mb-3">
                <label for="returnDescription" class="form-label">Description (optional)</label>
                <input
                    v-model="newReturn.description"
                    type="text"
                    class="form-control"
                    id="returnDescription"
                    placeholder="Describe the sale e.g 100 heads of cabbages"
                />
              </div>

              <div class="mb-3">
                <label for="returnAmount" class="form-label">Amount (KES)</label>
                <input
                    v-model="newReturn.amount"
                    type="number"
                    class="form-control"
                    id="returnAmount"
                    placeholder="Enter amount received"
                    min="0"
                    step="any"
                    required
                />
              </div>

              <div class="mb-3">
                <label for="returnDate" class="form-label">Date</label>
                <input
                    v-model="newReturn.date"
                    type="date"
                    class="form-control"
                    id="returnDate"
                    required
                />
                <div class="form-text">Date the return occurred.</div>
              </div>

              <button type="submit" class="btn btn-success w-100">Add Return</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-muted">Loading returns...</div>

    <!-- Table -->
    <div v-else>
      <table class="table table-bordered table-striped">
        <thead class="table-light">

        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
          <th style="width: 150px;">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in returnItems" :key="item.id">
          <td v-if="editReturn?.id !== item.id">{{ item.name }}</td>
          <td v-else><input v-model="editReturn.name" class="form-control" /></td>

          <td v-if="editReturn?.id !== item.id">{{ item.description }}</td>
          <td v-else><input v-model="editReturn.description" class="form-control" /></td>

          <td v-if="editReturn?.id !== item.id">{{ item.amount }}</td>
          <td v-else><input v-model="editReturn.amount" class="form-control" /></td>

          <td v-if="editReturn?.id !== item.id">{{ item.date }}</td>
          <td v-else><input v-model="editReturn.date" type="date" class="form-control" /></td>

          <td>
            <template v-if="editReturn?.id === item.id">
              <button class="btn btn-sm btn-primary me-1" @click="updateReturn">Save</button>
              <button class="btn btn-sm btn-secondary" @click="editReturn = null">Cancel</button>
            </template>
            <template v-else>
              <button class="btn btn-sm btn-warning me-1" @click="startEdit(item)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteReturn(item.id)">Delete</button>
            </template>
          </td>
        </tr>
        <tr v-if="!returnItems.length">
          <td colspan="5" class="text-center text-muted">No returns found.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
