import api from "../lib/api";

export const helpStore = {
    namespaced: true,
    state() {
        return {
            saving: false,
            loading: false,
            removing: false,
            records: []
        }
    },
    getters: {
        slugs(state) {
            let slugs = state.records.reduce((acc, record) => {
                acc[record.slug] = record;
                return acc;
            }, {});
            return slugs;
        }
    },
    actions: {
        async loadData({ commit }) {
            commit('setLoading', true);
            try {
                let { data: records } = await api.get('/config/help');
                commit('setRecords', records);
            } catch (err) {
                console.error(err);
            }
            commit('setLoading', false);
        },
        async save({ commit, dispatch }, { id = null, name, text = '' }) {
            let error = null;
            let record = null;
            try {
                commit('setSaving', true);
                let { data } = await api.post('/config/help', {
                    id,
                    name,
                    text
                });
                record = data;
                dispatch('loadData');
            } catch (err) {
                console.error(err);
                error = err;
            }
            commit('setSaving', false);
            if (error) {
                throw error;
            }
            return record;
        },
        async remove({ commit, dispatch }, { id }) {
            let error;
            try {
                commit('setRemoving', true);
                await api.delete(`/config/help/${id}`);
                dispatch('loadData');
            } catch (err) {
                console.error(err);
                error = err;
            }
            commit('setRemoving', false);
            if (error) {
                throw error;
            }
        }
    },
    mutations: {
        setRecords(state, records) {
            state.records = records;
        },
        setLoading(state, loading) {
            state.loading = !!loading;
        },
        setSaving(state, saving) {
            state.saving = !!saving;
        },
        setRemoving(state, removing) {
            state.removing = !!removing;
        }
    }
};


export default helpStore;