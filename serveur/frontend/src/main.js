import Vue from 'vue'
import 'es6-promise/auto'
import axios from 'axios'
import VueAuth from '@websanova/vue-auth'
import VueAxios from 'vue-axios'
import App from './App.vue'
import auth from './auth'
import router from './router'
import store from './store'


Vue.router = router

// Set Vue authentication
Vue.use(VueAxios, axios)
axios.defaults.baseURL = `http://localhost/api`
Vue.use(VueAuth, auth)

// Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');