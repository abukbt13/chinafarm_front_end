<script setup >
import Navbar from "./Navbar.vue";

const blogs = [
  {
    id: 1,
    title: '5 Secrets to Growing Healthy Tomatoes',
    summary: 'Discover the best techniques for cultivating tomatoes with rich flavor and high yield.',
    image: '/tomato.jpg',
    date: 'June 5, 2025'
  },
  {
    id: 2,
    title: 'Organic Farming: What You Should Know',
    summary: 'Understand the key practices and benefits of organic farming for sustainable growth.',
    image: '/organic.jpg',
    date: 'June 3, 2025'
  },
  {
    id: 3,
    title: 'How to Protect Your Farm from Pests',
    summary: 'Learn natural and chemical-free methods to safeguard your crops from common pests.',
    image: '/keepfrompests.jpg',
    date: 'May 30, 2025'
  }
]
</script>

<template>
  <Navbar />
  <section class="container ">
    <h2 class="text-center mb-5 text-success fw-bold">Latest Blog Posts</h2>
    <div class="row g-4">
      <div v-for="blog in blogs" :key="blog.id" class="col-12 col-md-4">
        <div class="card h-100 shadow-sm">
          <img :src="blog.image" class="card-img-top blog-img" :alt="blog.title" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-success">{{ blog.title }}</h5>
            <p class="card-text text-muted small mb-2">{{ blog.date }}</p>
            <p class="card-text">{{ blog.summary }}</p>
            <router-link :to="'/blog/' + blog.id" class="btn btn-outline-success mt-auto">Read More</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-img {
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}
</style>
