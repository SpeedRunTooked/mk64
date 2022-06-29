import axios from 'axios';
import { createStore } from 'vuex';
import { Game } from '@/game/Game';
import { config } from '@/config';

export default createStore({
    state: {
        game: new Game({
            users: {},
            times: {},
            categories: [],
            subcategoryGroups: [],
        }),
    },
    getters: {},
    mutations: {
        SAVE_API_DATA(state, data) {
            state.game = new Game(data);
        },
    },
    actions: {
        async getApiData({ commit }) {
            const result = await axios.get(config.ROOT_URL + '.json');
            commit('SAVE_API_DATA', result.data);
        },
    },
    modules: {},
});
