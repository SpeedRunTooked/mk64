<template>
    <div class="front-page">
        <recent-times></recent-times>
        <div class="spacer"></div>
        <recent-records></recent-records>
        <div class="spacer"></div>
        <record-summary></record-summary>
    </div>
</template>

<script lang="ts">
import RecentTimes from '@/components/RecentTimes.vue';
import RecentRecords from '@/components/RecentRecords.vue';
import RecordSummary from '@/components/RecordSummary.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FrontPageView',
    components: { RecentTimes, RecentRecords, RecordSummary },
});
</script>
