import axios from 'axios';
import { createStore } from 'vuex';
import { Game } from '@/game/Game';

export default createStore({
    state: {
        game: new Game(
            {
                categories: [],
                config: {
                    discordChannel: '',
                    discordChannelTest: '',
                    gameName: '',
                    gameSlug: '',
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
        dataLoaded: false,
    },
    getters: {},
    mutations: {
        SAVE_API_DATA(state, data): void {
            state.game = new Game(data.gameData, data.userData);
            state.dataLoaded = true;
        },
    },
    actions: {
        async getApiData({ commit }) {
            const response = await axios.get(process.env.VUE_APP_ROOT_URL);

            commit('SAVE_API_DATA', {
                gameData: response.data.game,
                userData: response.data.users,
            });
        },
    },
    modules: {},
});
