import bearer from '@websanova/vue-auth/drivers/auth/basic'
import axios from '@websanova/vue-auth/drivers/http/axios.1.x'
import router from '@websanova/vue-auth/drivers/router/vue-router.2.x'

// Auth base configuration some of this options
// can be override in method calls
const config = {
    auth: bearer,
    http: axios,
    router: router,
    tokenDefaultName: 'token_spa',
    tokenStore: ['localStorage'],
    rolesVar: 'role',
    parseUserData: function (data) {
      return data
    },
    registerData: {
        url: 'auth/register',
        method: 'POST',
        redirect: ''
    },
    loginData: {
        url: 'auth/login',
        method: 'POST',
        redirect: '',
        fetchUser: false
    },
    logoutData: {
        url: 'auth/logout',
        method: 'POST',
        redirect: '/login',
        makeRequest: true
    },
    fetchData: {
        url: 'auth/user',
        method: 'GET',
        enabled: true
    },
    refreshData: {url: 'auth/refresh',
        method: 'GET',
        enabled: false,
        interval: 30
    }
}

export default config