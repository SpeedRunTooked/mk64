<template>
    <div class="page-wrapper">
        <main-table></main-table>
        <div class="spacer"></div>
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
