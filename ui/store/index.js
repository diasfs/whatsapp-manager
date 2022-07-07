import { createStore } from 'vuex';

export const store = createStore({
    state() {
        return {
            show_side_bar: false
        }
    },
    mutations: {
        toggleSideBar(state) {
            state.show_side_bar = !state.show_side_bar
        }
    }
});

export default store;