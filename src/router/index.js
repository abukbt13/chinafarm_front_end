import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

import adminRoutes from './adminRoutes';
import userRoutes from './userRoutes';
import auth from './auth.js';
import Dashboard from '../views/Admin/Dashboard.vue';

const routes = [
    ...userRoutes,
    ...adminRoutes,
    ...auth,
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token'); // ensure this matches your login logic

    if (to.meta.requiresAuth && !token) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
