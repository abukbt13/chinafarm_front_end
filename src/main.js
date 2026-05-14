import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// ✅ Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// ✅ SweetAlert
import Swal from 'sweetalert2'
window.Swal = Swal

// ✅ Capacitor App
import { App as CapacitorApp } from '@capacitor/app'

const app = createApp(App)

app.use(router)

app.mount('#app')

// ✅ Android back button handling
CapacitorApp.addListener('backButton', () => {

    if (window.location.pathname === '/') {
        CapacitorApp.exitApp()
    } else {
        router.go(-1)
    }

})