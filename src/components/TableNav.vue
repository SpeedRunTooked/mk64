<template>
    <div class="row text-center row-even pagination-buttons">
        <div v-if="$parent" class="col-4 col-md-4">
            Rows {{ $parent.firstRow }}-{{ $parent.lastRow }} of
            {{ $parent.totalRows }}
        </div>

        <div class="col-2 col-md-1 bold text-right" title="Go to first page">
            <span
                v-if="$parent.previousPageExists()"
                class="clickable noselect material-symbols-outlined"
                @click="$parent.goToFirstPage()"
            >
                fast_rewind
            </span>
        </div>
        <div class="col-2 col-md-1 bold text-right" title="Go to previous page">
            <span
                v-if="$parent.previousPageExists()"
                class="clickable noselect material-symbols-outlined"
                @click="$parent.goToPreviousPage()"
            >
                arrow_back
            </span>
        </div>
        <div class="col-2 col-md-1 bold text-left" title="Go to next page">
            <span
                class="clickable material-symbols-outlined noselect"
                v-if="$parent.nextpageExists()"
                @click="$parent.goToNextPage()"
            >
                arrow_forward
            </span>
        </div>
        <div class="col-2 col-md-1 bold text-left" title="Go to last page">
            <span
                class="clickable noselect material-symbols-outlined noselect"
                v-if="$parent.nextpageExists()"
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
