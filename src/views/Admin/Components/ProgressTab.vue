<script setup>
import { ref, onMounted } from 'vue'
import api from "../../../composables/axios.js";
import { storage_link } from "../../../composables/storage_link.js";
const { storage_url } = storage_link()

const props = defineProps({
  seasonId: [String, Number]
})

const milestones = ref([])

// form state: pictures is array of objects (existing or new)
const newMilestone = ref({
  id: null,
  activity: '',
  date: '',
  description: '',
  pictures: [], // { type:'existing', filename, url } or { type:'new', file, preview }
  isEditing: false
})

// fetch list
const fetchMilestones = async () => {
  try {
    const res = await api.get(`/milestone/show/${props.seasonId}`)
    milestones.value = res.data.milestones
  } catch (err) {
    console.error('Failed to fetch milestones:', err)
  }
}

// open modal for adding
const startAddMilestone = () => {
  resetForm()
  // modal will open via data-bs-* attribute on button
}

// open modal for editing and populate fields
const EditPost = (data) => {
  newMilestone.value.id = data.id ?? null
  newMilestone.value.activity = data.activity ?? ''
  newMilestone.value.date = data.date ?? ''
  newMilestone.value.description = data.description ?? ''
  newMilestone.value.isEditing = true

  // convert existing picture paths into objects
  newMilestone.value.pictures = (data.pictures || []).map(p => ({
    type: 'existing',
    filename: p,            // store the path relative to storage (as returned by API)
    url: storage_url + p    // full url for preview
  }))
  // ensure no leftover previews
}

// handle new file selection
function handleFileChange(event) {
  const files = Array.from(event.target.files || [])
  files.forEach(file => {
    const preview = URL.createObjectURL(file)
    newMilestone.value.pictures.push({
      type: 'new',
      file,
      preview
    })
  })
  // clear file input (optional) so selecting same file again works
  event.target.value = ''
}

// remove image at index (works for existing and new)
function deleteImage(index) {
  alert('deleting existing image')
  const pic = newMilestone.value.pictures[index]
  if (!pic) return

  // if it's a new image revoke the created object URL
  if (pic.type === 'new' && pic.preview) {
  }
  newMilestone.value.pictures.splice(index, 1)
}

// submit (create or update)
const submitMilestone = async () => {
  try {
    const formData = new FormData()
    formData.append('activity', newMilestone.value.activity)
    formData.append('date', newMilestone.value.date)
    formData.append('description', newMilestone.value.description)

    // append new files and keep existing filenames separately
    newMilestone.value.pictures.forEach(pic => {
      if (pic.type === 'new') {
        formData.append('pictures[]', pic.file)
      } else if (pic.type === 'existing') {
        // send the filename/path your backend recognizes to keep it
        formData.append('existing[]', pic.filename)
      }
    })

    if (newMilestone.value.isEditing && newMilestone.value.id) {
      // adjust endpoint / method as your backend expects (PUT/PATCH/POST)
      await api.post(`/milestone/${props.seasonId}/${newMilestone.value.id}`, formData)
    } else {
      await api.post(`/milestone/${props.seasonId}`, formData)
    }

    // cleanup previews to avoid memory leaks
    newMilestone.value.pictures.forEach(pic => {
      if (pic.type === 'new' && pic.preview) {
        try { URL.revokeObjectURL(pic.preview) } catch (e) {}
      }
    })

    await fetchMilestones()
    // close modal (your close button has id="closeModalBtn")
    document.getElementById('closeModalBtn')?.click()
    resetForm()
  } catch (err) {
    console.error('Error submitting milestone:', err)
  }
}

function resetForm() {
  // revoke previews too
  newMilestone.value.pictures.forEach(pic => {
    if (pic.type === 'new' && pic.preview) {
      try { URL.revokeObjectURL(pic.preview) } catch (e) {}
    }
  })
  newMilestone.value = {
    id: null,
    activity: '',
    date: '',
    description: '',
    pictures: [],
    isEditing: false
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
      <button @click="startAddMilestone" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMilestoneModal">
        Add Milestone
      </button>
    </div>

    <div v-if="milestones.length === 0" class="text-muted">
      <h2>No milestone found!</h2>
    </div>

    <ul v-else class="list-group">
      <li v-for="milestone in milestones" :key="milestone.id" class="list-group-item">
        <div class="d-flex">
          <div>
            <h5>{{ milestone.activity }}</h5>
            <p>{{ milestone.description }}</p>
            <strong>{{ milestone.date }}</strong>
          </div>

          <div class="ms-auto">
            <div class="dropdown post-menu position-relative" style="right: 1rem; top: 0;">
              <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots-vertical fs-4"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li>
                  <button class="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addMilestoneModal" @click="EditPost(milestone)">
                    <i class="bi bi-pencil-square me-2 text-primary"></i> Edit Post
                  </button>
                </li>
                <li>
                  <button class="dropdown-item d-flex align-items-center text-danger" @click="DeletePost && DeletePost(milestone.id)">
                    <i class="bi bi-trash3 me-2"></i> Delete Post
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-2 row row-cols-1 row-cols-lg-2 g-2">
          <div v-for="pic in milestone.pictures" :key="pic" class="col">
            <img :src="storage_url + pic" class="img-thumbnail w-100" />
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
              <h5 class="modal-title">{{ newMilestone.isEditing ? "Editing Milestone" : "New Milestone" }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" id="closeModalBtn" />
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Activity</label>
                <input v-model="newMilestone.activity" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="newMilestone.description" class="form-control" rows="3" required></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Pictures</label>
                <input type="file" multiple accept="image/*" @change="handleFileChange" class="form-control mb-3" />
                <!-- Unified preview (existing + new) -->
                <div class="d-flex flex-wrap gap-2">
                  <div v-for="(pic, idx) in newMilestone.pictures" :key="idx" class="position-relative" style="width:200px; height:200px;">
                    <img
                        :src="pic.type === 'existing' ? pic.url : pic.preview"
                        class="img-thumbnail"
                        style="width:100%; height:100%; object-fit:cover;"
                        :alt="pic.filename || 'preview'"
                    />
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0" @click="deleteImage(idx)">✕</button>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Date</label>
                <input v-model="newMilestone.date" type="date" class="form-control" required />
              </div>

              <button type="submit" class="btn btn-success">
                {{ newMilestone.isEditing ? 'Edit Milestone' : 'Add Milestone' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
