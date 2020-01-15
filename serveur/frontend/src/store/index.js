import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
    },
    getters: {
        allData: state => {
            return state
        }
    },
    mutations: {
    },
    actions: {
    }
})

// Subscribe to store updates
/* store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    console.log('change state : ', state)
    localStorage.setItem('store', JSON.stringify(state))
}) */

export default store
