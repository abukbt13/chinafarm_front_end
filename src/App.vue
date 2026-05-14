<script setup>
import { RouterView, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { App as CapacitorApp } from '@capacitor/app'

const router = useRouter()

onMounted(() => {
  CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      router.back()
    } else {
      CapacitorApp.exitApp()
    }
  })
})
</script>

<template>
  <RouterView />
</template>

<style>
</style>