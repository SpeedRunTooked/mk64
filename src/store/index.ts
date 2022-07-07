import axios from 'axios';
import { createStore } from 'vuex';
import { Game } from '@/game/Game';
import { config } from '@/config';

export default createStore({
    state: {
        game: new Game({
            users: [],
            entries: [],
            categories: [],
            gamedata: {
                subcategoryGroups: [],
                oldRecords: [],
            },
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
            const gameAxiosResponse = await axios.get(
                config.ROOT_URL + '.json',
            );
            const usersAxiosResponse = await axios.get(config.GET_USERS_URL);

            console.log(usersAxiosResponse.data);

            gameAxiosResponse.data.users = usersAxiosResponse.data;
            commit('SAVE_API_DATA', gameAxiosResponse.data);
        },
    },
    modules: {},
});
