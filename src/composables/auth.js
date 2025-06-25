// composables/auth.js
import { ref } from 'vue'
import axios from 'axios'
import api from '../composables/axios'
import router from "../router/index.js";
const user = ref(null)
const isLoggedIn = ref(false)

const base_url=import.meta.env.VITE_API_BASE_URL

const token = localStorage.getItem('token')

export function auth() {
    const AuthUser = async () => {

        if (!token) {z
            user.value = null
            isLoggedIn.value = false
            return
        }

        try {
            const response = await api.get(base_url+'user')
            user.value = response.data
            isLoggedIn.value = true
        } catch (error) {
            console.error('Failed to fetch user:', error)
            await router.push('/login')
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
