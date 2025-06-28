import AdminDashboard from "../views/Admin/AdminDashboard.vue";
import AdminHome from "../views/Admin/AdminHome.vue";
import ActiveCrops from "../components/ActiveCrops.vue";
import LatestBlogs from "../components/LatestBlogs.vue";
import FarmProgress from "../views/Admin/FarmProgress.vue";

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
                path: 'farm-progress',
                name: 'ActiveCrops',
                component: ActiveCrops
            },
            {
                path: 'farm-progress/:id',
                component: FarmProgress
            },
            {
                path: 'blogs',
                name: 'blogs',
                component: LatestBlogs
            }
        ]
    }
]
