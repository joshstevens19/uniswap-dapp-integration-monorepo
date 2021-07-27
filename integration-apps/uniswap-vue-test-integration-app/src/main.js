import UniswapVue from 'uniswap-vue'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(UniswapVue)

app.mount('#app')
