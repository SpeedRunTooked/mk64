<template>
    <div class="full-data-page">
        <main-table></main-table>
    </div>
</template>

<script lang="ts">
import MainTable from '@/components/MainTable.vue';

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FullPageView',
    components: { MainTable },
});
</script>
