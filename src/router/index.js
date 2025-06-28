import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

import axios from 'axios'
import adminRoutes from './adminRoutes';
import userRoutes from './userRoutes';
import auth from './auth.js';
import guestRoutes from "./guestRoutes.js";

const routes = [
    ...userRoutes,
    ...adminRoutes,
    ...guestRoutes,
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
            return next({ name: 'login' })
        }

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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
