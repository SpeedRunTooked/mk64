<template>
    <div class="page-wrapper">
        <record-leaders></record-leaders>
    </div>
</template>

<script lang="ts">
import RecordLeaders from '@/components/RecordLeaders.vue';

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LeaderboardView',
    components: { RecordLeaders },
});
</script>
