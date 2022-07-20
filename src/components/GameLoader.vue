<template>
    <div>
        <div class="row">
            <div class="col">
                <img class="logo-img" :src="getLogoUrl()" />
            </div>
        </div>

        <nav>
            <router-link :to="getRoute('')">Summary</router-link> |
            <router-link :to="getRoute('leaderboard')">Leaderboard</router-link>
            | <router-link :to="getRoute('stats')">Stats</router-link> |
            <router-link :to="getRoute('data')">Data</router-link> |
            <router-link :to="getRoute('submit')">Submit</router-link>
        </nav>
        <router-view v-if="dataLoaded" />
        <div v-else class="row">
            <div class="col">Loading data...</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted, defineProps } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps(['gameId']);

onMounted(async () => {
    await store.dispatch('updateGameId', { gameId: props.gameId });
    await store.dispatch('getApiData');
});

const getRoute = (path: string) => {
    return `/${props.gameId}/${path}`;
};

const dataLoaded = computed((): boolean => {
    return store.state.dataLoaded;
});

const getLogoUrl = () => {
    return `${process.env.VUE_APP_STORAGE_URL}/${process.env.VUE_APP_DATABASE}%2F${props.gameId}%2Fgame-logo.png?alt=media`;
};
</script>

<style>
.stats-table {
    padding: 0 30px;
}
</style>
