import AdminDashboard from "../views/Admin/AdminDashboard.vue";
import AdminHome from "../views/Admin/AdminHome.vue";
import FarmingProgress from "../views/Admin/FarmingProgress.vue";
import LatestBlogs from "../components/LatestBlogs.vue";
import FarmProgressDetails from "../views/Admin/FarmProgressDetails.vue";
import CropSeasons from "../views/Admin/CropSeasons.vue";

export default [
    {
        path: '/admin',
        component: AdminDashboard, // Layout file with <router-view />
        meta: { requiresAuth: true },
        children: [
            {
                path: '', //  this means /admin will load AdminHome.vue
                component: AdminHome
            },
            {
                path: 'farm-progress',
                component: FarmingProgress
            },
            {
                path: 'farm-progress/:id',
                component: FarmProgressDetails
            },
            {
                path: 'crops-seasons',
                component: CropSeasons
            },
            {
                path: 'blogs',
                component: LatestBlogs
            }
        ]
    }
]
