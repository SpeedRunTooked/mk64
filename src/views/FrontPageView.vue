<template>
    <div class="page-wrapper">
        <div class="container">
            <div
                class="row game-row"
                v-for="game in gamesInfo"
                :key="game.gameId"
            >
                <a :href="`/${game.gameId}`">
                    <div class="col">
                        <div class="row">
                            <div class="col game-img">
                                <img
                                    class="logo-img"
                                    :src="getLogoUrl(game.gameId)"
                                />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col game-name">
                                {{ game.gameName }}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div class="spacer"></div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref } from 'vue';

interface GamesInfo {
    gameId: string;
    gameName: string;
}

let gamesInfo: Ref<GamesInfo[]> = ref([
    {
        gameId: 'mk64',
        gameName: 'Mario Kart 64',
    },
    {
        gameId: 'msfs',
        gameName: 'Landing Challenges',
    },
]);

axios.get(`${process.env.VUE_APP_ROOT_URL}/ping`);

const getLogoUrl = (gameId: string) => {
    return `${process.env.VUE_APP_STORAGE_URL}/${process.env.VUE_APP_DATABASE}%2F${gameId}%2Fgame-logo.png?alt=media`;
};
</script>

<style>
.stats-table {
    padding: 0 30px;
}

.game-name {
    font-size: 18px;
    margin-top: 20px;
}
.game-row {
    margin: 50px;
}
.logo-img {
    max-height: 100px;
}
</style>
