<template>
    <div class="row text-center row-even pagination-buttons">
        <div class="col-4 col-md-4" v-if="!hideTextDisplay">
            Rows {{ table.firstRow.value }}-{{ table.lastRow.value }} of
            {{ table.totalRows.value }}
        </div>

        <div class="col bold text-right" title="Go to first page">
            <span
                v-if="table.previousPageExists.value && !hideFastArrows"
                class="clickable noselect material-symbols-outlined"
                @click="table.goToFirstPage()"
            >
                fast_rewind
            </span>
        </div>
        <div class="col bold text-right" title="Go to previous page">
            <span
                v-if="table.previousPageExists.value"
                class="clickable noselect material-symbols-outlined"
                @click="table.goToPreviousPage()"
            >
                arrow_back
            </span>
        </div>
        <div class="col bold text-left" title="Go to next page">
            <span
                class="clickable material-symbols-outlined noselect"
                v-if="table.nextPageExists.value"
                @click="table.goToNextPage()"
            >
                arrow_forward
            </span>
        </div>
        <div class="col bold text-left" title="Go to last page">
            <span
                class="clickable noselect material-symbols-outlined noselect"
                v-if="table.nextPageExists.value && !hideFastArrows"
                @click="table.goToLastPage()"
            >
                fast_forward
            </span>
        </div>
        <div class="col-12">
            <div class="row"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps(['table', 'hideFastArrows', 'hideTextDisplay']);
</script>

<style scoped>
.pagination-buttons {
    margin-top: 20px;
    height: 32px;
    font-size: 14px;
}

.navigation-arrow {
    font-size: 32px;
}

.refresh i {
    font-size: 18px;
    line-height: 35px;
}
</style>
