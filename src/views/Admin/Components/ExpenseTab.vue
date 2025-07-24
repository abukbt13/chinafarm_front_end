<script setup>
import { ref, onMounted } from 'vue'
import api from "../../../composables/axios.js";

const props = defineProps({
  seasonId: {
    type: [Number, String],
    required: true
  }
})

const expenses = ref([])
const newExpense = ref({ name: '', description: '', date: '' ,amount:''})
const editExpense = ref(null)
const loading = ref(true)


// Fetch all expenses
const fetchExpenses = async () => {
  try {
    const res = await api.get(`expenses/${props.seasonId}`)
    expenses.value = res.data.expenses
    // console.log(res)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Create
const submitExpense = async () => {
  try {
    await api.post('expenses/' + props.seasonId, { ...newExpense.value, farming_progress_id: props.seasonId })
    newExpense.value = { name: '', description: '', date: '' ,amount: ''}
    await fetchExpenses()
  } catch (err) {
    console.error(err)
  }
}

// Edit
const startEdit = (expense) => {
  editExpense.value = { ...expense }
}

// Update
const updateExpense = async () => {
  try {
    await api.post('expenses/update/'+props.seasonId+'/'+editExpense.value.id, editExpense.value)
    editExpense.value = null
    await fetchExpenses()
  } catch (err) {
    console.error(err)
  }
}

// Delete
const deleteExpense = async (id) => {
  if (confirm('Are you sure you want to delete this expense?')) {
    try {
      await api.delete('expenses/delete/'+props.seasonId +'/'+ id)
      await fetchExpenses()
    } catch (err) {
      console.error(err)
    }
  }
}

onMounted(() => {
  fetchExpenses()
})
</script>

<template>
  <div class="p-3">
    <!-- New Expense Form -->
    <div class="modal fade" id="expense" tabindex="-1" aria-labelledby="expense" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="expense">New Expense</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitExpense" class="mb-4">
              <!-- Name -->
              <div class="mb-3">
                <label for="expenseName" class="form-label">Expense Name</label>
                <input
                    v-model="newExpense.name"
                    type="text"
                    class="form-control"
                    id="expenseName"
                    placeholder="e.g. Seeds, Fertilizer"
                    required
                >
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label for="expenseDescription" class="form-label">Description (optional)</label>
                <input
                    v-model="newExpense.description"
                    type="text"
                    class="form-control"
                    id="expenseDescription"
                    placeholder="Short description"
                >
              </div>

              <!-- Amount -->
              <div class="mb-3">
                <label for="expenseAmount" class="form-label">Amount (KES)</label>
                <input
                    v-model="newExpense.amount"
                    type="number"
                    class="form-control"
                    id="expenseAmount"
                    placeholder="Enter amount spent"
                    min="0"
                    step="any"
                    required
                >
              </div>

              <!-- Date -->
              <div class="mb-3">
                <label for="expenseDate" class="form-label">Date</label>
                <input
                    v-model="newExpense.date"
                    type="date"
                    class="form-control"
                    id="expenseDate"
                    required
                >
                <div class="form-text">Pick the date this expense occurred.</div>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-success w-100">Add Expense</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="text-muted">Loading expenses...</div>

    <!-- Table -->
    <div v-else>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
        <tr>
          <th colspan="5"> <h4>Expense View<button class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#expense">Add Expense</button>  </h4> </th>
        </tr>

        </thead>
        <tbody>
        <tr>
          <td>Name</td>
          <td>Description</td>
          <td>Amount</td>
          <td>Date</td>
          <td style="width: 150px;">Actions</td>
        </tr>
        <tr v-for="expense in expenses" :key="expense.id">
          <td v-if="editExpense?.id !== expense.id">{{ expense.name }}</td>
          <td v-else><input v-model="editExpense.name" class="form-control" /></td>

          <td v-if="editExpense?.id !== expense.id">{{ expense.description }}</td>
          <td v-else><input v-model="editExpense.description" class="form-control" /></td>

          <td v-if="editExpense?.id !== expense.id">{{ expense.amount }}</td>
          <td v-else><input v-model="editExpense.amount" class="form-control" /></td>

          <td v-if="editExpense?.id !== expense.id">{{ expense.date }}</td>
          <td v-else><input v-model="editExpense.date" type="date" class="form-control" /></td>

          <td>
            <template v-if="editExpense?.id === expense.id">
              <button class="btn btn-sm btn-primary me-1" @click="updateExpense">Save</button>
              <button class="btn btn-sm btn-secondary" @click="editExpense = null">Cancel</button>
            </template>
            <template v-else>
              <button class="btn btn-sm btn-warning me-1" @click="startEdit(expense)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteExpense(expense.id)">Delete</button>
            </template>
          </td>
        </tr>
        <tr v-if="!expenses.length">
          <td colspan="4" class="text-center text-muted">No expenses found.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
