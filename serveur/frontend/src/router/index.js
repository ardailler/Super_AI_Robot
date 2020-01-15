import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
    { path: '/', component: 'HelloWorld', name: 'home', children: [] },
    { path: '*', component: 'NotFound', children: [] }
]

const routes = routerOptions.map(route => {
    return getRouteRec(route)
})

function getRouteRec (route) {
    let result = {
        ...route,
        component: () => import(`@/components/page/${route.component}.vue`)
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
