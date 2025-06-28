
import GuestDashboard from "../views/Guest/GuestDashboard.vue";
import GuestHome from "../views/Guest/GuestHome.vue";

export default [
    {
        path: '/guest',
        component: GuestDashboard, // Layout file with <router-view />
        meta: { requiresAuth: true },
        children: [
            {
                path: '', // 👈 this means /admin will load AdminHome.vue
                component: GuestHome
            },

        ]
    }
]
