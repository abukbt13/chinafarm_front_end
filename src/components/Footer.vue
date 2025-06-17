<script setup>
</script>

<template>
  <footer class="text-white pt-5 pb-3 mt-5 custom-green-footer">
    <div class="container">
      <div class="row">
        <!-- About Column -->
        <div class="col-md-4 mb-4">
          <h5 class="text-light">🌱 China Farm</h5>
          <p>
            We are passionate about sustainable farming. From seedlings to vegetables, we empower communities with knowledge and food.
          </p>
          <router-link to="/about">
            <button class="btn btn-outline-light btn-sm mt-2">More About Us</button>
          </router-link>
        </div>

        <!-- Links Column -->
        <div class="col-md-4 mb-4">
          <h6 class="text-uppercase text-light">Explore</h6>
          <ul class="list-unstyled">
            <li><router-link to="/services" class="text-white text-decoration-none">Our Services</router-link></li>
            <li><router-link to="/crops" class="text-white text-decoration-none">Crops</router-link></li>
            <li><router-link to="/location" class="text-white text-decoration-none">Location</router-link></li>
          </ul>
        </div>

        <!-- Actions Column -->
        <div class="col-md-4 mb-4">
          <h6 class="text-uppercase text-light">Get Involved</h6>
          <ul class="list-unstyled">
            <li><router-link to="/donate" class="text-white text-decoration-none">Donate</router-link></li>
            <li><router-link to="/shop" class="text-white text-decoration-none">Buy from Us</router-link></li>
            <li><router-link to="/visit" class="text-white text-decoration-none">Visit Us</router-link></li>
            <li><router-link to="/appointment" class="text-white text-decoration-none">Book Appointment</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="text-center border-top border-white pt-3 mt-4">
        <small>&copy; 2025 China Farm. Helping farmers grow better, together.</small>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.custom-green-footer {
  background-color: #267026;
}
footer {
  font-size: 0.95rem;
}
footer h5, footer h6 {
  font-weight: 600;
}
footer ul li {
  margin-bottom: 0.5rem;
}
footer a:hover {
  text-decoration: underline;
}
</style>
