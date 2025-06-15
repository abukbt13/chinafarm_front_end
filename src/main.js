import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// ✅ (Optional) Import Bootstrap JS (for components like modals, dropdowns)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
app.use(router)
app.mount('#app')
