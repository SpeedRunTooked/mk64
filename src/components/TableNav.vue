<template>
    <div class="row text-center row-even pagination-buttons">
        <div class="col-4 col-md-4" v-if="showTextDisplay">
            Rows {{ firstRow }}-{{ lastRow }} of
            {{ totalRows }}
        </div>

        <div class="col bold text-right" title="Go to first page">
            <span
                v-if="previousPageExists && showFastArrows"
                class="clickable noselect material-symbols-outlined"
                @click="goToFirstPage()"
            >
                fast_rewind
            </span>
        </div>
        <div class="col bold text-right" title="Go to previous page">
            <span
                v-if="previousPageExists"
                class="clickable noselect material-symbols-outlined"
                @click="goToPreviousPage()"
            >
                arrow_back
            </span>
        </div>
        <div class="col bold text-left" title="Go to next page">
            <span
                class="clickable material-symbols-outlined noselect"
                v-if="nextPageExists"
                @click="goToNextPage()"
            >
                arrow_forward
            </span>
        </div>
        <div class="col bold text-left" title="Go to last page">
            <span
                class="clickable noselect material-symbols-outlined noselect"
                v-if="nextPageExists && showFastArrows"
                @click="goToLastPage()"
            >
                fast_forward
            </span>
        </div>
        <div class="col-12">
            <div class="row"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        showTextDisplay: {
            default: true,
            type: Boolean,
        },
        showFastArrows: {
            default: true,
            type: Boolean,
        },
        nextPageExists: {
            type: Boolean,
            required: true,
        },
        goToNextPage: {
            type: Function,
            required: true,
        },
        previousPageExists: {
            type: Boolean,
            required: true,
        },
        goToPreviousPage: {
            type: Function,
            required: true,
        },
        goToLastPage: {
            type: Function,
            required: true,
        },
        goToFirstPage: {
            type: Function,
            required: true,
        },
        firstRow: {
            type: Number,
            required: true,
        },
        lastRow: {
            type: Number,
            required: true,
        },
        totalRows: {
            type: Number,
            required: true,
        },
    },
});
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
