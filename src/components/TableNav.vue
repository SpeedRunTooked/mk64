<template>
    <div class="row text-center row-even pagination-buttons">
        <div class="col-4 col-md-4" v-if="showTextDisplay">
            Rows {{ $parent.firstRow }}-{{ $parent.lastRow }} of
            {{ $parent.totalRows }}
        </div>

        <div class="col bold text-right" title="Go to first page">
            <span
                v-if="$parent.previousPageExists() && showFastArrows"
                class="clickable noselect material-symbols-outlined"
                @click="$parent.goToFirstPage()"
            >
                fast_rewind
            </span>
        </div>
        <div class="col bold text-right" title="Go to previous page">
            <span
                v-if="$parent.previousPageExists()"
                class="clickable noselect material-symbols-outlined"
                @click="$parent.goToPreviousPage()"
            >
                arrow_back
            </span>
        </div>
        <div class="col bold text-left" title="Go to next page">
            <span
                class="clickable material-symbols-outlined noselect"
                v-if="$parent.nextPageExists()"
                @click="$parent.goToNextPage()"
            >
                arrow_forward
            </span>
        </div>
        <div class="col bold text-left" title="Go to last page">
            <span
                class="clickable noselect material-symbols-outlined noselect"
                v-if="$parent.nextPageExists() && showFastArrows"
                @click="$parent.goToLastPage()"
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
import { defineComponent } from '@vue/composition-api';

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
