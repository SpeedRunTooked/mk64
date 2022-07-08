<template>
    <div class="front-page">
        <recent-entries></recent-entries>
        <record-summary></record-summary>
    </div>
</template>

<script lang="ts">
import RecentEntries from '@/components/RecentEntries.vue';
import RecordSummary from '@/components/RecordSummary.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FrontPageView',
    components: { RecentEntries, RecordSummary },
});
</script>

<style>
.front-page {
    margin-top: -20px;
    margin-bottom: 40px;
}
</style>
