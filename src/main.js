// import Vue from "vue"
// import App from "./App.vue"
// import router from "./router"

// Vue.config.productionTip = false

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount("#app")

import { createApp } from 'vue'
// import { createPinia } from "pinia"

import App from './App.vue'
import { router } from './router'
import { store } from './store/store'

const app = createApp(App)

// app.use(createPinia())
app.use(router)
app.use(store)

app.mount("#app")
