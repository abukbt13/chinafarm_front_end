import AdminDashboard from "../views/Admin/AdminDashboard.vue";
import AdminHome from "../views/Admin/AdminHome.vue";
import ActiveCrops from "../components/ActiveCrops.vue";

export default [
    {
        path: '/admin',
        component: AdminDashboard, // Layout file with <router-view />
        meta: { requiresAuth: true },
        children: [
            {
                path: '', // 👈 this means /admin will load AdminHome.vue
                component: AdminHome
            },
            {
                path: 'progress',
                name: 'ActiveCrops',
                component: ActiveCrops
            }
        ]
    }
]
