<script setup>
import { ref, onMounted } from 'vue'
import api from "../composables/axios.js";
import {storage_link} from "../composables/storage_link.js";

const {storage_url} =storage_link()
const blogs = ref([])
const form = ref({
  title: '',
  summary: '',
  content: '',
  image: null
})
const isSubmitting = ref(false)

const fetchBlogs = async () => {
  try {
    const res = await api.get("/show-blogs")
    blogs.value = res.data.blogs
  } catch (error) {
    console.error(error)
  }
}

const handleFileChange = (e) => {
  form.value.image = e.target.files[0]
}

const resetForm = () => {
  form.value = { title: '', summary: '', content: '', image: null }
}

const createBlog = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    Object.keys(form.value).forEach((key) => {
      if (form.value[key]) formData.append(key, form.value[key])
    })

    await api.post("/create-blogs", formData)
    await fetchBlogs()
    resetForm()
    const modalEl = document.getElementById('blogModal')
    const modal = bootstrap.Modal.getInstance(modalEl)
    modal.hide()
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchBlogs)
</script>

<template>
  <section class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-success fw-bold">Latest Blog Posts</h2>
      <!-- Button trigger modal -->
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#blogModal">
        + New Blog
      </button>
    </div>

    <!-- Blog Cards -->
    <div class="row g-4">
      <div v-for="blog in blogs" :key="blog.id" class="col-12 col-md-4">

        <div class="card h-100 shadow-sm">
          <img
              :src="storage_url + blog.image"
              class="img-thumbnail w-100"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-success">{{ storage_url + blog.image }}</h5>
            <p class="card-text text-muted small mb-2">
              {{ new Date(blog.created_at).toLocaleDateString() }}
            </p>
            <p class="card-text">{{ blog.summary }}</p>
            <div class="mt-auto">
              {{blog}}
              <router-link :to="'/blogs/' + blog.hash_id" class="btn btn-outline-success">
                Read More
              </router-link>
              <router-link :to="'/blogs/' + blog.id + '/edit'" class="btn btn-warning btn-sm ms-2">
                Edit
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
        class="modal fade"
        id="blogModal"
        tabindex="-1"
        aria-labelledby="blogModalLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="createBlog">
            <div class="modal-header">
              <h5 class="modal-title text-success" id="blogModalLabel">Create Blog</h5>
              <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  @click="resetForm"
              ></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input v-model="form.title" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Summary</label>
                <textarea v-model="form.summary" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea v-model="form.content" rows="4" class="form-control"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Image</label>
                <input type="file" class="form-control" @change="handleFileChange" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetForm">
                Cancel
              </button>
              <button type="submit" class="btn btn-success" :disabled="isSubmitting">
                {{ isSubmitting ? 'Saving...' : 'Save Blog' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-img {
  height: 200px;
  object-fit: cover;
}
</style>
