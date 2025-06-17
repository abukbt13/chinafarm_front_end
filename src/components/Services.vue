<script setup>
// Optionally, you could use this to fetch services later
const services = [
  {
    title: 'Seedlings for Sale',
    description: 'We provide a variety of high-quality tree and vegetable seedlings ready for transplanting.',
    icon: '🌱'
  },
  {
    title: 'Seedling Preparation',
    description: 'From seed selection to nursery setup, we specialize in preparing healthy seedlings for farms.',
    icon: '🧑‍🌾'
  },
  {
    title: 'Fresh Vegetables',
    description: 'Enjoy fresh, organic vegetables directly from our farm to your home or market.',
    icon: '🥦'
  },
  {
    title: 'Sustainable Farming Education',
    description: 'We train farmers and learners on eco-friendly and profitable farming practices.',
    icon: '📚'
  }
]
</script>

<template>
  <section class="container py-5">
    <h2 class="text-center mb-5 text-success fw-bold">Our Services</h2>
    <div class="row g-4">
      <div v-for="(service, index) in services" :key="index" class="col-md-6">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex">
            <div class="me-4 fs-1 text-success">{{ service.icon }}</div>
            <div>
              <h5 class="card-title fw-bold">{{ service.title }}</h5>
              <p class="card-text">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card:hover {
  transform: translateY(-3px);
  transition: 0.3s ease-in-out;
}
</style>
