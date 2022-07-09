<template>
    <div class="page-wrapper">
        <div class="row">
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

<script lang="ts">
import { defineComponent } from 'vue';
import PopularRuns from '@/components/PopularRuns.vue';
import ContestedRuns from '@/components/ContestedRuns.vue';
import WorldRecords from '@/components/WorldRecords.vue';

export default defineComponent({
    name: 'StatsPageView',
    components: { PopularRuns, ContestedRuns, WorldRecords },
});
</script>

<style>
.stats-table {
    padding: 0 30px;
}
</style>
