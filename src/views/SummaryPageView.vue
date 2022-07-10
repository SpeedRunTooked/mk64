<template>
    <div class="page-wrapper">
        <recent-entries></recent-entries>
        <div class="spacer"></div>
        <record-summary></record-summary>
        <div class="spacer"></div>
    </div>
</template>

<script lang="ts">
import RecentEntries from '@/components/RecentEntries.vue';
import RecordSummary from '@/components/RecordSummary.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SummaryPageView',
    components: { RecentEntries, RecordSummary },
});
</script>
