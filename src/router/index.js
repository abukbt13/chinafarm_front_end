import { createRouter, createWebHistory } from 'vue-router'
import Home from "../views/Home.vue";

import adminRoutes from './adminRoutes'
import userRoutes from './userRoutes'

// Combine all route arrays
const routes = [
    ...userRoutes,
    ...adminRoutes,
    // You can add more route files here

    {
        path: '/',
        component: Home
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
