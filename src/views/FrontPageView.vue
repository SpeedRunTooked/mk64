<template>
    <div class="home">
        <recent-times></recent-times>
    </div>
</template>

<script lang="ts">
import RecentTimes from '@/components/RecentTimes.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FrontPageView',
    components: { RecentTimes },
});
</script>
