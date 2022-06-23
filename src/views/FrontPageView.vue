<template>
    <div class="front-page">
        <recent-times></recent-times>
        <record-summary></record-summary>
    </div>
</template>

<script lang="ts">
import RecentTimes from '@/components/RecentTimes.vue';
import RecordSummary from '@/components/RecordSummary.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FrontPageView',
    components: { RecentTimes, RecordSummary },
});
</script>
