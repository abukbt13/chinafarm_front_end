<script setup>
import { ref, onMounted } from 'vue'
import api from "../../../composables/axios.js";
import Swal from 'sweetalert2'
import {storage_link} from "../../../composables/storage_link.js";
const { storage_url } = storage_link()

const props = defineProps({
  seasonId: [String, Number]
})
const milestones = ref([])
const pictures = ref([])
const activity = ref('')
const date = ref('')
const description = ref('')
const isEditing = ref(false)
const currentPictures = ref([])
const editId = ref(null)



const fetchMilestones = async () => {
  try {
    const res = await api.get(`/milestone/show/${props.seasonId}`)
    milestones.value = res.data.milestone
  } catch (err) {
    console.error('Failed to fetch milestones:', err)
  }
}

const previewImages = ref([]) // For preview URLs

function handleFileChange(event) {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    pictures.value.push(file)
    previewImages.value.push(URL.createObjectURL(file))
  })
}

function removeImage(index) {
  pictures.value.splice(index, 1)
  previewImages.value.splice(index, 1)
}
const fileInput = ref(null)
function clearForm(){
  isEditing.value= false
  activity.value=''
  date.value =''
  editId.value = null
  description.value=''
  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = '' // This resets the file input
  }
  pictures.value = []
  previewImages.value= []
}

const EditPost = (data) =>{
  editId.value = data.id
  isEditing.value=true
  activity.value = data.activity
  description.value = data.description
  date.value = data.date
  currentPictures.value = data.pictures
}

const DeleteMilestone = async (data) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This milestone will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.post(`/milestone/delete/${data}`)
        await fetchMilestones()

        Swal.fire(
            'Deleted!',
            'The milestone has been deleted.',
            'success'
        )
      } catch (error) {
        Swal.fire(
            'Error!',
            'Something went wrong while deleting the milestone.',
            'error'
        )
      }
    }
  })
}


const submitMilestone = async () => {
  const formData = new FormData()
  formData.append('activity', activity.value)
  formData.append('date', date.value)
  formData.append('description', description.value)

  // append new pictures (uploaded during editing)
  pictures.value.forEach(file => {
    formData.append('pictures[]', file)
  })

  // append current pictures (to keep them in DB if not deleted)
  currentPictures.value.forEach(pic => {
    formData.append('current_pictures[]', pic)
  })

  try {
    if (isEditing.value) {
      // Editing existing milestone
      await api.post(`/milestone/update/${editId.value}`, formData)
    } else {
      // Creating new milestone
      await api.post(`/milestone/${props.seasonId}`, formData)
    }

    await fetchMilestones()
    clearForm()

    Swal.fire(
        'Success!',
        isEditing.value ? 'Milestone updated successfully!' : 'Milestone created successfully!',
        'success'
    )
  } catch (err) {
    console.error('Error submitting milestone:', err)
    Swal.fire('Error!', 'Something went wrong.', 'error')
  }
}
onMounted( () => {
  fetchMilestones()
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Progress Milestones</h4>
      <button  @click="clearForm()"  class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMilestoneModal">
        Add Milestone
      </button>
    </div>

    <div v-if="milestones.length === 0" class="text-muted">
      <h2>No milestone found!</h2>
    </div>
    <ul v-else class="list-group">
      <li v-for="milestone in milestones" :key="milestone.id" class="list-group-item">
        <div class="d-flex">
          <div class="">
            <h2>Description</h2>
            <p>{{ milestone.description }}</p>
            <strong>{{ milestone.date }}</strong>
          </div>
          <!--         operation buttons-->
          <div class="">
            <div class="dropdown post-menu d-flex position-absolute" style="right: 1rem; top: 1rem;">
              <!-- Three dots button -->
              <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots-vertical fs-4"></i>
              </button>

              <!-- Dropdown menu -->
              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li>
                 <span data-bs-toggle="modal" data-bs-target="#addMilestoneModal" @click="EditPost(milestone)" class="dropdown-item d-flex align-items-center">
                   <i class="bi bi-pencil-square me-2 text-primary"></i> Edit Post
                 </span>
                </li>
                <li>
                 <span @click="DeleteMilestone(milestone.id)"  class="dropdown-item d-flex align-items-center text-danger">
                   <i class="bi bi-trash3 me-2"></i> Delete Post
                 </span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div class="mt-2 row row-cols-1 row-cols-lg-2 g-2">
          <div v-for="pic in milestone.pictures" :key="pic" class="col">
            <img
                :src="storage_url + pic"
                :alt="pic"
                class="img-thumbnail w-100"
            />
          </div>
        </div>

      </li>
    </ul>

    <!-- Modal -->
    <div class="modal fade" id="addMilestoneModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="submitMilestone">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? "Editing Milestone " : "New Milestone"}}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" id="closeModalBtn" />
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Activity</label>
                <input v-model="activity" type="text" placeholder="enter activity like Weeding" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="description" class="form-control" rows="3" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Pictures</label>
                <input
                    type="file"
                    multiple
                    ref="fileInput"
                    accept="image/*"
                    @change="handleFileChange"
                    class="form-control mb-3"
                />

                <!-- Image preview section -->
                <div class="d-flex flex-wrap gap-3">
                  <div
                      v-for="(img, index) in previewImages"
                      :key="index"
                      class="position-relative rounded shadow-sm overflow-hidden border"
                      style="width: 120px; height: 120px;"
                  >
                    <!-- Image -->
                    <img
                        :src="img"
                        alt="Preview"
                        class="w-100 h-100"
                        style="object-fit: cover;"
                    />

                    <!-- Remove button -->
                    <button
                        type="button"
                        class="btn btn-sm btn-light position-absolute top-0 end-0 m-1 rounded-circle shadow"
                        style="width: 28px; height: 28px; padding: 0; line-height: 1;"
                        @click="removeImage(index)"
                    >
                      ✕
                    </button>
                  </div>
                </div>

               <div class="" v-if="isEditing">
                 <h2 class="text-center">Uploaded Pictures</h2>
                 <div class="" style="display: flex;flex-direction: row;">
                    <div  v-for="pic in currentPictures" :key="pic" class="col">
                   <img
                       style=" width: 200px; height: 200px;"
                       :src="storage_url + pic"
                       :alt="pic"
                       class="img-thumbnail"
                   />
                 </div>
                 </div>
               </div>

              </div>
              <div class="mb-3">
                <label class="form-label">Date</label>
                <input v-model="date" type="date" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-success">
                {{ isEditing ? 'Edit Milestone' : 'Add Milestone' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.edit-icon-wrapper {
  position: absolute;
  right: 2rem;
  display: inline-block;
  cursor: pointer;
  font-size: 2rem;
  color: #555;
  transition: color 0.3s ease;
}

.edit-icon-wrapper:hover {
  color: #0d6efd; /* Bootstrap primary blue */
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  width: max-content;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 4px 8px;
  border-radius: 6px;
  position: absolute;
  right: 100%; /* show on left of icon */
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: 0.85rem;
  transition: opacity 0.3s;
}

.edit-icon-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

</style>
