<script setup>
import { ref, onMounted } from 'vue'
import api from "../../../composables/axios.js";
import Swal from 'sweetalert2'
import { storage_link } from "../../../composables/storage_link.js";
import imageCompression from 'browser-image-compression'

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

const previewImages = ref([])
const fileInput = ref(null)

/*
|--------------------------------------------------------------------------
| FULLSCREEN IMAGE VIEWER
|--------------------------------------------------------------------------
*/

const selectedImage = ref(null)

const openImage = (image) => {
  selectedImage.value = image
}

const closeImage = () => {
  selectedImage.value = null
}

/*
|--------------------------------------------------------------------------
| FETCH MILESTONES
|--------------------------------------------------------------------------
*/

const fetchMilestones = async () => {
  try {
    const res = await api.get(`/milestone/show/${props.seasonId}`)
    milestones.value = res.data.milestone
  } catch (err) {
    console.error('Failed to fetch milestones:', err)
  }
}

/*
|--------------------------------------------------------------------------
| IMAGE UPLOAD + COMPRESSION
|--------------------------------------------------------------------------
*/

async function handleFileChange(event) {

  const files = Array.from(event.target.files || [])

  if (files.length === 0) return

  pictures.value = []
  previewImages.value = []

  for (const file of files) {

    try {

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true
      })

      pictures.value.push(compressedFile)

      previewImages.value.push(
          URL.createObjectURL(compressedFile)
      )

    } catch (error) {
      console.error('Compression error:', error)
    }
  }
}

/*
|--------------------------------------------------------------------------
| REMOVE PREVIEW IMAGE
|--------------------------------------------------------------------------
*/

function removeImage(index) {

  pictures.value.splice(index, 1)

  previewImages.value.splice(index, 1)
}

/*
|--------------------------------------------------------------------------
| CLEAR FORM
|--------------------------------------------------------------------------
*/

function clearForm() {

  isEditing.value = false

  activity.value = ''

  date.value = ''

  editId.value = null

  description.value = ''

  currentPictures.value = []

  if (fileInput.value) {
    fileInput.value.value = ''
  }

  pictures.value = []

  previewImages.value = []
}

/*
|--------------------------------------------------------------------------
| EDIT
|--------------------------------------------------------------------------
*/

const EditPost = (data) => {

  editId.value = data.id

  isEditing.value = true

  activity.value = data.activity

  description.value = data.description

  date.value = data.date

  currentPictures.value = data.pictures
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| SUBMIT
|--------------------------------------------------------------------------
*/

const submitMilestone = async () => {

  const formData = new FormData()

  formData.append('activity', activity.value)

  formData.append('date', date.value)

  formData.append('description', description.value)

  pictures.value.forEach(file => {
    formData.append('pictures[]', file)
  })

  currentPictures.value.forEach(pic => {
    formData.append('current_pictures[]', pic)
  })

  try {

    if (isEditing.value) {

      await api.post(
          `/milestone/update/${editId.value}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
      )

    } else {

      await api.post(
          `/milestone/${props.seasonId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
      )
    }

    await fetchMilestones()

    clearForm()

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: isEditing.value
          ? 'Milestone updated successfully!'
          : 'Milestone created successfully!'
    })

  } catch (err) {

    console.error(err)

    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Something went wrong.'
    })
  }
}

onMounted(() => {
  fetchMilestones()
})
</script>

<template>

  <div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Progress Milestones</h4>

      <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addMilestoneModal"
      >
        Add Milestone
      </button>
    </div>

    <!-- EMPTY -->

    <div v-if="milestones.length === 0" class="text-muted">
      <h2>No milestone found!</h2>
    </div>

    <!-- LIST -->

    <ul v-else class="list-group">

      <li
          v-for="milestone in milestones"
          :key="milestone.id"
          class="list-group-item"
      >

        <div class="d-flex">

          <div>
            <h5>Description</h5>

            <p>{{ milestone.description }}</p>

            <strong>{{ milestone.date }}</strong>
          </div>

          <!-- DROPDOWN -->

          <div class="dropdown ms-auto">

            <button
                class="btn btn-link p-0"
                type="button"
                data-bs-toggle="dropdown"
            >
              <i class="bi bi-three-dots-vertical fs-4"></i>
            </button>

            <ul class="dropdown-menu dropdown-menu-end shadow">

              <li>
                <span
                    data-bs-toggle="modal"
                    data-bs-target="#addMilestoneModal"
                    @click="EditPost(milestone)"
                    class="dropdown-item d-flex align-items-center"
                >
                  <i class="bi bi-pencil-square me-2 text-primary"></i>
                  Edit Post
                </span>
              </li>

              <li>
                <span
                    @click="DeleteMilestone(milestone.id)"
                    class="dropdown-item d-flex align-items-center text-danger"
                >
                  <i class="bi bi-trash3 me-2"></i>
                  Delete Post
                </span>
              </li>

            </ul>
          </div>
        </div>

        <!-- IMAGES -->

        <div class="mt-3 row row-cols-1 row-cols-lg-2 g-2">

          <div
              v-for="pic in milestone.pictures"
              :key="pic"
              class="col"
          >

            <img
                :src="storage_url + pic"
                :alt="pic"
                class="img-thumbnail w-100 preview-image"
                @click="openImage(storage_url + pic)"
            />

          </div>
        </div>

      </li>
    </ul>

    <!-- FULLSCREEN IMAGE VIEWER -->

    <div
        v-if="selectedImage"
        class="image-overlay"
        @click="closeImage"
    >

      <button
          class="close-btn"
          @click.stop="closeImage"
      >
        ✕
      </button>

      <img
          :src="selectedImage"
          class="fullscreen-image"
          @click.stop
      />

    </div>

    <!-- MODAL -->

    <div
        class="modal fade"
        id="addMilestoneModal"
        tabindex="-1"
        aria-hidden="true"
    >

      <div class="modal-dialog modal-lg">

        <div class="modal-content">

          <form @submit.prevent="submitMilestone">

            <div class="modal-header">

              <h5 class="modal-title">
                {{ isEditing ? "Editing Milestone" : "New Milestone" }}
              </h5>

              <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
              />
            </div>

            <div class="modal-body">

              <!-- ACTIVITY -->

              <div class="mb-3">

                <label class="form-label">
                  Activity
                </label>

                <select
                    v-model="activity"
                    required
                    class="form-control"
                >

                  <option disabled value="">
                    Select Activity
                  </option>

                  <option value="Farm Visit">
                    Farm Visit
                  </option>

                  <option value="At Work">
                    At Work
                  </option>

                  <option value="Passing By">
                    Passing By
                  </option>

                </select>
              </div>

              <!-- DESCRIPTION -->

              <div class="mb-3">

                <label class="form-label">
                  Description
                </label>

                <textarea
                    v-model="description"
                    class="form-control"
                    rows="3"
                />
              </div>

              <!-- PICTURES -->

              <div class="mb-3">

                <label class="form-label">
                  Pictures
                </label>

                <input
                    type="file"
                    multiple
                    ref="fileInput"
                    accept="image/*"
                    @change="handleFileChange"
                    class="form-control mb-3"
                />

                <!-- PREVIEW -->

                <div class="d-flex flex-wrap gap-3">

                  <div
                      v-for="(img, index) in previewImages"
                      :key="index"
                      class="position-relative rounded shadow-sm overflow-hidden border"
                      style="width:120px;height:120px;"
                  >

                    <img
                        :src="img"
                        class="w-100 h-100"
                        style="object-fit:cover;"
                    />

                    <button
                        type="button"
                        class="btn btn-sm btn-light position-absolute top-0 end-0 m-1 rounded-circle shadow"
                        style="width:28px;height:28px;padding:0;"
                        @click="removeImage(index)"
                    >
                      ✕
                    </button>

                  </div>
                </div>

                <!-- EXISTING -->

                <div v-if="isEditing" class="mt-4">

                  <h5 class="text-center">
                    Uploaded Pictures
                  </h5>

                  <div class="d-flex flex-wrap gap-2">

                    <div
                        v-for="pic in currentPictures"
                        :key="pic"
                    >

                      <img
                          :src="storage_url + pic"
                          :alt="pic"
                          class="img-thumbnail"
                          style="width:200px;height:200px;object-fit:cover;"
                      />

                    </div>

                  </div>
                </div>

              </div>

              <!-- DATE -->

              <div class="mb-3">

                <label class="form-label">
                  Date
                </label>

                <input
                    v-model="date"
                    type="date"
                    class="form-control"
                    required
                />
              </div>

              <!-- BUTTON -->

              <button
                  type="submit"
                  class="btn btn-success"
              >
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

.preview-image{
  cursor:pointer;
  transition:0.3s;
}

.preview-image:hover{
  transform:scale(1.02);
}

.image-overlay{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.9);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:9999;
  padding:20px;
}

.fullscreen-image{
  max-width:100%;
  max-height:100%;
  object-fit:contain;
  border-radius:10px;
}

.close-btn{
  position:absolute;
  top:20px;
  right:20px;
  background:white;
  border:none;
  width:45px;
  height:45px;
  border-radius:50%;
  font-size:22px;
  font-weight:bold;
  cursor:pointer;
}

</style>