import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'

const http = axios.create({
  baseURL: process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://localhost/todos',
});

Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');