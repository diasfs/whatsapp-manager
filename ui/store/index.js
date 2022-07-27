import { createStore } from 'vuex';
import api from '~/lib/api';

export const store = createStore({
    state() {
        return {
            show_side_bar: false,
            connections: []
        }
    },
    actions: {
        async updateConnections() {
            try {
                let { data: connections } = await api.get('/whatsapp/conexoes');
                this.connections = connections;
            } catch (error) {
                this.connections = [];
            }
        }
    },
    mutations: {
        toggleSideBar(state) {
            state.show_side_bar = !state.show_side_bar
        }
    }
});


let update = async () => {
    await store.dispatch('updateConnections');
    setTimeout(update, 10000);
}
update();
export default store;