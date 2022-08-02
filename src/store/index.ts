import axios from 'axios';
import { createStore } from 'vuex';
import { Game } from '@/game/Game';

export default createStore({
    state: {
        gameId: '',
        game: new Game(
            {
                categories: [],
                subcategories: [],
                config: {
                    discordChannel: '',
                    discordChannelTest: '',
                    gameName: '',
                    gameSlug: '',
                    allowFileUploads: false,
                    showOldRecords: false,
                    defaultEntryType: 'score',
                    sortAlphabetically: false,
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
        UPDATE_GAME_ID(state, data): void {
            state.gameId = data.gameId;
        },
        SAVE_API_DATA(state, data): void {
            state.game = new Game(data.gameData, data.userData);
            state.dataLoaded = true;
        },
    },
    actions: {
        async updateGameId({ commit }, payload) {
            commit('UPDATE_GAME_ID', payload);
        },
        async getApiData({ commit }) {
            const response = await axios.get(
                `${process.env.VUE_APP_ROOT_URL}/gameData?gameId=${this.state.gameId}`,
            );

            commit('SAVE_API_DATA', {
                gameData: response.data.game,
                userData: response.data.users,
            });
        },
    },
    modules: {},
});
