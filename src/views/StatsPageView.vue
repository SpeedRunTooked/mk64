<template>
    <div class="page-wrapper">
        <div class="row" v-if="game.config.showOldRecords">
            <div class="col"><world-records></world-records></div>
        </div>
        <div class="spacer"></div>
        <div class="row">
            <div class="col"><popular-runs></popular-runs></div>
            <div class="col"><contested-runs></contested-runs></div>
        </div>
        <div class="spacer"></div>
    </div>
</template>

<script setup lang="ts">
import PopularRuns from '@/components/PopularRuns.vue';
import ContestedRuns from '@/components/ContestedRuns.vue';
import WorldRecords from '@/components/WorldRecords.vue';
import { useStore } from 'vuex';
import { Game } from '@/game/Game';
import { computed } from '@vue/reactivity';

const game = computed((): Game => useStore().state.game);
</script>

<style>
.stats-table {
    padding: 0 30px;
}
</style>
