import { createStore } from 'vuex';
import axios from 'axios';
import { Game } from '@/game/Game';
import { config } from '@/config';

export default createStore({
    state: {
        data: new Game({
            users: {},
            times: {},
            categories: [],
            subcategoryGroups: [],
        }),
    },
    getters: {},
    mutations: {
        SAVE_APIDATA(state, data) {
            state.data = new Game(data);
        },
    },
    actions: {
        async getApiData({ commit }) {
            const result = await axios.get(config.ROOT_URL + '.json');
            commit('SAVE_APIDATA', result.data);
        },
    },
    modules: {},
});
