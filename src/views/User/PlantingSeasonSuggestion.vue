<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import api from "../../composables/axios.js";


const cropName = ref("");
const planting_month = ref("");
const harvesting_month = ref("");
const reason = ref("");
const suggestions = ref([]);

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

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
      planting_month: planting_month.value,
      harvesting_month: harvesting_month.value,
      reason: reason.value, // save HTML
    });

    cropName.value = "";
    planting_month.value = "";
    harvesting_month.value = "";
    reason.value = "";
    fetchSuggestions();
    // Close modal after submit
    const modal = bootstrap.Modal.getInstance(document.getElementById("suggestModal"));
    modal.hide();


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
    <div class="d-flex justify-content-around align-items-center mb-4">
      <h4 class="mb-3">Planting  Suggestions</h4>
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
      <div class="modal-dialog modal-lg">
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
                <label class="form-label">Planting Month</label>
                <select v-model="planting_month" class="form-control">
                  <option disabled value="">Select Month</option>

                  <option
                      v-for="month in months"
                      :key="month"
                      :value="month"
                  >
                    {{ month }}
                  </option>
                </select>
              </div> 
              <div class="mb-3">
                <label class="form-label">Harvesting Month</label>
                <select v-model="harvesting_month" class="form-control">
                  <option disabled value="">Select Month</option>

                  <option
                      v-for="month in months"
                      :key="month"
                      :value="month"
                  >
                    {{ month }}
                  </option>
                </select>              </div>

              <div class="mb-3">
                <label class="form-label">Reason/reason</label>
                <!-- Replace textarea with Tiptap -->
                <textarea v-model="reason" class="form-control" height="4">

                </textarea>
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

      <div v-if="suggestions.length === 0" class="text-muted text-center">
        No suggestions yet.
      </div>

        <div class="row g-4">
          <div
              v-for="(s, index) in suggestions"
              :key="index"
              class="col-lg-4 col-md-6"
          >
            <div class="card suggestion-card h-100 border-0">

              <!-- Header -->
              <div class="card-header bg-transparent border-0 text-center pt-4">

                <h5 class="fw-bold text-success mb-0">
                  {{ s.crop_name }}
                </h5>
              </div>

              <!-- Body -->
              <div class="card-body text-center px-4">

                <!-- Months Section -->
                <div class="d-flex justify-content-between align-items-center mb-3">

                  <div>
                    <small class="text-muted d-block">Planting</small>
                    <span class="badge bg-success-subtle text-success fw-semibold px-3 py-2">
                {{ s.planting_month }}
              </span>
                  </div>

                  <div class="text-muted fw-bold">
                    →
                  </div>

                  <div>
                    <small class="text-muted d-block">Harvest</small>
                    <span class="badge bg-warning-subtle text-warning fw-semibold px-3 py-2">
                {{ s.harvesting_month }}
              </span>
                  </div>

                </div>

                <!-- Reason -->
                <div class="reason-box text-start mt-3">
                  <p class="mb-0 small" v-html="s.reason"></p>
                </div>

              </div>

              <!-- Footer -->
              <div class="card-footer bg-transparent border-0 text-center pb-3">
                <small class="text-muted">
                  Posted on {{ new Date(s.created_at).toLocaleDateString() }}
                </small>
              </div>

            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.suggestion-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: #ffffff;
}

.suggestion-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.icon-circle {
  width: 55px;
  height: 55px;
  background: #e9f7ef;
  color: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: auto;
}

.reason-box {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px;
  min-height: 70px;
}
</style>
