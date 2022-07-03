<template>
    <div class="stats-page-wrapper">
        <div class="row">
            <div class="col"><popular-runs></popular-runs></div>
            <div class="col"><popular-runs></popular-runs></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopularRuns from '@/components/PopularRuns.vue';

export default defineComponent({
    name: 'StatsPageView',
    components: { PopularRuns },
});
</script>

<style>
.front-page {
    margin-top: -20px;
    margin-bottom: 40px;
}
.stats-table {
    padding: 0 30px;
}
.stats-page-wrapper {
    /* margin-top: -25px; */
}
</style>
