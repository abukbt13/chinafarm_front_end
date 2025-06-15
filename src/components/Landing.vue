<script setup>
</script>

<template>
  <div class="p-4">
    <section class="d-flex flex-wrap align-items-stretch bg-light rounded shadow p-4">
      <!-- Left Column: Text -->
      <div class="col-12 col-md-6 mb-4 mb-md-0 d-flex flex-column justify-content-center">
        <h1 class="display-5 fw-bold text-success">Welcome to China Farm</h1>
        <p class="lead mt-3">
          We grow vegetables and tree seedlings while educating others to do the same.
          Explore our farm, learn new methods, and join the movement!
        </p>
        <router-link to="/crops">
          <button class="btn btn-success mt-4 shadow">View Our Crops</button>
        </router-link>
      </div>

      <!-- Right Column: Full-Fit Image -->
      <div class="col-md-6 d-none d-md-block">
        <div class="image-container h-100 w-100">
          <img src="/cabbage.jpeg" alt="Crops on the farm" class="img-cover rounded shadow" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.image-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures image fills space without stretching */
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
}
</style>
