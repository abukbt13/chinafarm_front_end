import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

// ✅ (Optional) Import Bootstrap JS (for components like modals, dropdowns)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Swal from 'sweetalert2';
window.Swal = Swal;
const app = createApp(App)
app.use(router)
app.mount('#app')
