import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

export default createStore({
    state: {
        user: {
            email: "",
            name: "",
            role: ""
        }
    },
    mutations: {
        SET_USER(state, value) {
            state.user = value.data
        }
    },
    plugins: [createPersistedState()]
})