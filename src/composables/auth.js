// composables/auth.js
import { ref } from 'vue'
import axios from 'axios'
import api from '../composables/axios'
import router from "../router/index.js";
const user = ref(null)
const isLoggedIn = ref(false)


const token = localStorage.getItem('token')

export function auth() {
    const AuthUser = async () => {

        if (!token) {
            user.value = null
            isLoggedIn.value = false
            return
        }

        try {
            const response = await api.get('user')
            user.value = response.data
            isLoggedIn.value = true
        } catch (error) {
            console.error('Failed to fetch user:', error)
            // await router.push('/login')
            user.value = null
            isLoggedIn.value = false
        }
    }

    return {
        user,
        isLoggedIn,
        AuthUser,
    }
}
