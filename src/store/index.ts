import { createStore } from 'vuex';
import axios from 'axios';
import { ApiData } from '@/ApiData';

const ROOT_URL = 'https://mk64-ad77f-default-rtdb.firebaseio.com/';

export default createStore({
    state: {
        data: new ApiData({
            gamedata: {
                cups: [],
            },
            users: {},
            times: {},
            recordtypes: [],
        }),
    },
    getters: {},
    mutations: {
        SAVE_APIDATA(state, data) {
            state.data = new ApiData(data);
        },
    },
    actions: {
        async getApiData({ commit }) {
            const result = await axios.get(ROOT_URL + '.json');
            console.log(result);
            commit('SAVE_APIDATA', result.data);
        },
    },
    modules: {},
});
