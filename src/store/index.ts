import { createStore } from 'vuex';
import axios from 'axios';
import { Game } from '@/game/Game';

const ROOT_URL = 'https://mk64-ad77f-default-rtdb.firebaseio.com/db/';

export default createStore({
    state: {
        data: new Game({
            gamedata: {
                subcategoryGroups: [],
            },
            users: {},
            times: {},
            categories: [],
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
            const result = await axios.get(ROOT_URL + '.json');
            commit('SAVE_APIDATA', result.data);
        },
    },
    modules: {},
});
