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
const newExpense = ref({ name: '', description: '', date: '' })
const editExpense = ref(null)
const loading = ref(true)

// Fetch all expenses
const fetchExpenses = async () => {
  try {
    const res = await api.get(`expenses/${props.seasonId}`)
    expenses.value = res.data.expenses
    console.log(res)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Create
const submitExpense = async () => {
  try {
    await api.post('expenses', { ...newExpense.value, farming_progress_id: props.seasonId })
    newExpense.value = { name: '', description: '', date: '' }
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
    await api.put(`expenses/${editExpense.value.id}`, editExpense.value)
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
      await api.delete(`expenses/${id}`)
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
    <h4 class="mb-4">Expenses</h4>
    <!-- New Expense Form -->
    <form @submit.prevent="submitExpense" class="mb-4">
      <div class="row g-2">
        <div class="col-md-3">
          <input v-model="newExpense.name" type="text" class="form-control" placeholder="Name" required>
        </div>
        <div class="col-md-4">
          <input v-model="newExpense.description" type="text" class="form-control" placeholder="Description">
        </div>
        <div class="col-md-3">
          <input v-model="newExpense.date" type="date" class="form-control" required>
        </div>
        <div class="col-md-2">
          <button type="submit" class="btn btn-success w-100">Add</button>
        </div>
      </div>
    </form>

    <!-- Loading -->
    <div v-if="loading" class="text-muted">Loading expenses...</div>

    <!-- Table -->
    <div v-else>
      <table class="table table-bordered table-striped">
        <thead class="table-light">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Date</th>
          <th style="width: 150px;">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="expense in expenses" :key="expense.id">
          <td v-if="editExpense?.id !== expense.id">{{ expense.name }}</td>
          <td v-else><input v-model="editExpense.name" class="form-control" /></td>

          <td v-if="editExpense?.id !== expense.id">{{ expense.description }}</td>
          <td v-else><input v-model="editExpense.description" class="form-control" /></td>

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
