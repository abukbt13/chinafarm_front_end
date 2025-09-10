<script setup>

import Navbar from "../components/Navbar.vue";
import Landing from "../components/Landing.vue";
import Footer from "../components/Footer.vue";
import LatestBlogs from "../components/LatestBlogs.vue";
import Testimonials from "../components/Testimonials.vue";
</script>

<template>
  <div class="contents">

    <Navbar />
    <Landing />
    <LatestBlogs />
    <Testimonials />
    <Footer msg="Powered by Vue & Laravel" />
  </div>
</template>

<style scoped>

</style>