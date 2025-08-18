import Login from "../views/Authentication/Login.vue";
import Register from "../views/Authentication/Register.vue";
import Profile from "../views/user/Profile.vue";

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
