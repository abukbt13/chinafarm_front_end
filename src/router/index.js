import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

import axios from 'axios'
import adminRoutes from './adminRoutes';
import userRoutes from './userRoutes';
import auth from './auth.js';
import api from "../composables/axios.js";
import LatestBlogs from "../components/LatestBlogs.vue";

const routes = [
    ...userRoutes,
    ...adminRoutes,
    ...auth,
    {
        path: '/',
        name: 'Home',
        component: Home,
    },


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token')

        if (!token) {
            return next('/login')
        }

        try {
            const response = await api.get('user');

            if (response.status === 200) {
                next()
            } else {
                next({ name: 'login' })
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            next({ name: 'login' })
        }
    } else {
        next()
    }
});


export default router;
