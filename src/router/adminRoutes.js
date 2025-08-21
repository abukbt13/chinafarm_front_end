import AdminDashboard from "../views/Admin/AdminDashboard.vue";
import AdminHome from "../views/Admin/AdminHome.vue";
import FarmProjects from "../views/Admin/FarmProjects.vue";
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
                path: 'farm-projects',
                component: FarmProjects
            },
            {
                path: 'project-progress/:id',
                component: FarmProgressDetails
            },
            {
                path: 'crop-suggestion',
                component: CropSeasons
            },
            {
                path: 'blogs',
                component: LatestBlogs
            }
        ]
    }
]
