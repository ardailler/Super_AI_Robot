import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
    {
        path: '/',
        component: 'Home',
        name: 'home',
        children: [],
        meta: {
            auth: undefined
        }
    },
    {
        path: '/login',
        name: 'login',
        component: 'Login',
        meta: {
            auth: false
        }
    },
    // USER ROUTES
    {
        path: '/dashboard',
        name: 'dashboard',
        component: 'Dashboard',
        meta: {
            auth: true
        }
    },
    {
        path: '/Salle/:id',
        name: 'editSalle',
        component: 'EditSalle',
        meta: {
            auth: true
        }
    },
    {
        path: '/arnaud',
        name: 'arnaud',
        component: 'Arnaud',
        meta: {
            auth: undefined
        }
    },
    {
        path: '*',
        component: 'NotFound',
        children: []
    }
]

const routes = routerOptions.map(route => {
    return getRouteRec(route)
})

function getRouteRec (route) {
    let result = {
        ...route,
        component: () => import(`@/components/pages/${route.component}.vue`)
    }

    if (route.hasOwnProperty('children')) {
        result['children'] = route.children.map(children => {
            return getRouteRec(children, children.path)
        })
    }

    return result
}

Vue.use(Router)

export default new Router({
    routes,
    mode: 'history'
})
