import Vue from 'vue'
import 'es6-promise/auto'
import axios from 'axios'
import VueAuth from '@websanova/vue-auth'
import VueAxios from 'vue-axios'
import App from './App.vue'
import auth from './auth'
import router from './router'
import store from './store'

// Set Vue globally
window.Vue = Vue
window.axios = axios
Vue.router = router

// Set Vue authentication
Vue.use(VueAxios, axios)
const location = document.location // localhost || @Ip
axios.defaults.baseURL = `http://${location.hostname}/api`
Vue.use(VueAuth, auth)

// Vue.prototype.$http = http
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')