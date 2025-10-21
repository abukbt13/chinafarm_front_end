import UserDashboard from "../views/User/UserDashboard.vue";
import UserHome from "../views/User/UserHome.vue";
import FarmProjects from "../views/User/FarmProjects.vue";
import LatestBlogs from "../components/LatestBlogs.vue";
import FarmProgressDetails from "../views/User/FarmProgressDetails.vue";
import PlantingSeasonSuggestion from "../views/User/PlantingSeasonSuggestion.vue";

export default [
    {
        path: '/user',
        component: UserDashboard, // Layout file with <router-view />
        meta: { requiresAuth: true },
        children: [
            {
                path: '', //  this means /admin will load AdminHome.vue
                component: UserHome
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
                component: PlantingSeasonSuggestion
            },
            {
                path: 'blogs',
                component: LatestBlogs
            }
        ]
    }
]
