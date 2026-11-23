import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import { vReveal, vTilt } from './animations/motion'

const app = createApp(App)
app.directive('reveal', vReveal)
app.directive('tilt', vTilt)
app.use(createPinia())
app.use(router)
app.mount('#app')
