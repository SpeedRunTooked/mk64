import axios from 'axios';
import { createStore } from 'vuex';
import { Game } from '@/game/Game';
import { config } from '@/config';

export default createStore({
    state: {
        game: new Game(
            {
                categories: [],
                config: {
                    discordChannel: '',
                    discordChannelTest: '',
                    entryType: '',
                },
                gamedata: {
                    subcategoryGroups: [],
                    oldRecords: [],
                },
                entries: {},
                userList: [],
            },
            {},
        ),
    },
    getters: {},
    mutations: {
        SAVE_API_DATA(state, data): void {
            state.game = new Game(data.gameData, data.userData);
        },
    },
    actions: {
        async getApiData({ commit }) {
            const gameAxiosRequest = axios.get(config.ROOT_URL + '.json');
            const usersAxiosRequest = axios.get(config.GET_USERS_URL);

            const [gameAxiosResponse, usersAxiosResponse] = await Promise.all([
                gameAxiosRequest,
                usersAxiosRequest,
            ]);

            commit('SAVE_API_DATA', {
                gameData: gameAxiosResponse.data,
                userData: usersAxiosResponse.data,
            });
        },
    },
    modules: {},
});
