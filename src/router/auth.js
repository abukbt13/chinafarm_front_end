import Login from "../views/Authentication/Login.vue";
import Register from "../views/Authentication/Register.vue";

export default [

    {
        path: '/register',
        component: Register
    },
    {
        path: '/login',
        name:'login',
        component: Login
    },
]
