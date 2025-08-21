<script setup>
import { ref, onMounted } from "vue";
import api from "../../composables/axios.js";

const cropName = ref("");
const period = ref("");
const factor = ref("");
const suggestions = ref([]);

const fetchSuggestions = async () => {
  try {
    const res = await api.get("/planting-suggestions");
    suggestions.value = res.data;
  } catch (error) {
    console.error(error);
  }
};

const submitSuggestion = async () => {
  try {
    await api.post("/planting-suggestions", {
      crop_name: cropName.value,
      period: period.value,
      factor: factor.value,
    });

    cropName.value = "";
    period.value = "";
    factor.value = "";

    // Close modal after submit
    const modal = bootstrap.Modal.getInstance(document.getElementById("suggestModal"));
    modal.hide();

    fetchSuggestions();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchSuggestions();
});
</script>

<template>
  <div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>🌱 Planting Season Suggestions</h2>
      <!-- Suggest Button -->
      <button
          class="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#suggestModal"
      >
        Suggest
      </button>
    </div>

    <!-- Modal -->
    <div
        class="modal fade"
        id="suggestModal"
        tabindex="-1"
        aria-labelledby="suggestModalLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="suggestModalLabel">
              Propose a Planting Season
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitSuggestion">
              <div class="mb-3">
                <label class="form-label">Crop Name</label>
                <input v-model="cropName" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Period (e.g., March - August)</label>
                <input v-model="period" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Reason/Factor</label>
                <textarea v-model="factor" class="form-control" rows="3"></textarea>
              </div>

              <button type="submit" class="btn btn-success w-100">
                Submit Suggestion
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggestions Dashboard -->
    <div>
      <h4 class="mb-3">My Suggestions</h4>
      <div v-if="suggestions.length === 0" class="text-muted text-center">
        No suggestions yet.
      </div>

      <div class="row g-3">
        <div
            v-for="(s, index) in suggestions"
            :key="index"
            class="col-md-4 col-sm-6"
        >
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
              <h5 class="card-title text-success">{{ s.crop_name }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">
                Period: {{ s.period }}
              </h6>
              <p class="card-text">
                <strong>Factor:</strong> {{ s.factor }}
              </p>
            </div>
            <div class="card-footer text-muted small">
              Suggested on {{ new Date(s.created_at).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
