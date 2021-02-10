import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/lib/theme-chalk/display.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)

app.mount('#app')
