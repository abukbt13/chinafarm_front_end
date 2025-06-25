<script setup>
import { ref, onMounted } from 'vue'
import AddCropForm from "./AddCropForm.vue";

onMounted(() => {
  import('bootstrap/dist/js/bootstrap.bundle.min.js') // Load Bootstrap JS if not global
})

const showModal = ref(false)

const openModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('addCropModal'))
  modal.show()
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">🌾 Active Crops</h3>
      <button class="btn btn-success" @click="openModal">
        ➕ Add Planting Plan
      </button>
    </div>

    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="crop in 3" :key="crop">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">Cabbages - Season 1</h5>
            <p class="card-text">Planted on: May 10, 2025<br>Estimated harvest: Aug 15, 2025</p>
            <span class="badge bg-success">Growing</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addCropModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">🌱 Add Planting Plan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <AddCropForm @saved="() => bootstrap.Modal.getInstance(document.getElementById('addCropModal')).hide()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
