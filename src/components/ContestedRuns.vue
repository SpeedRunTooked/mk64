<template>
    <div v-if="selectedCategory" class="stats-table mx-auto">
        <div class="row section-header">
            <div class="col title">Most Contested</div>
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="filterDropdowns.categorySlug"
                        @change="table.goToFirstPage()"
                    >
                        <option
                            v-for="category in game.categories"
                            :key="category.slug"
                            :value="category.slug"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col category-header">
                {{ selectedCategory.subcategoryName || 'Subcategory' }}
            </div>
            <div class="col category-header">Times Contested</div>
        </div>
        <div
            v-for="run in table.activeRows.value"
            :key="run.subcategory.slug"
            class="row subcategory-row"
        >
            <div class="col">{{ run.subcategory.name }}</div>
            <div class="col">
                {{ run.timesContested }}
            </div>
        </div>
        <div
            v-for="index in table.emptyRows.value"
            :key="index"
            class="row subcategory-row"
        >
            <div class="col">-</div>
            <div class="col">-</div>
        </div>
        <div class="row">
            <div class="col">
                <table-nav
                    :show-text-display="false"
                    :show-fast-arrows="false"
                    :nextPageExists="table.nextPageExists.value"
                    :goToNextPage="table.goToNextPage"
                    :previousPageExists="table.previousPageExists.value"
                    :goToPreviousPage="table.goToPreviousPage"
                    :goToLastPage="table.goToLastPage"
                    :goToFirstPage="table.goToFirstPage"
                    :firstRow="table.firstRow.value"
                    :lastRow="table.lastRow.value"
                    :totalRows="table.totalRows.value"
                ></table-nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { Run } from '@/game/Run';
import { Game } from '@/game/Game';
import { Category } from '@/game/Category';
import TableNav from '@/components/TableNav.vue';
import { ref, computed, reactive } from '@vue/reactivity';
import { TableOptions, useTable } from '@/composables/useTable';

const game = computed<Game>(() => useStore().state.game);

const filterDropdowns = reactive({
    categorySlug: '3lap',
});

const filters = reactive({
    category: {
        value: computed(() => filterDropdowns.categorySlug),
        getFilterValue: (run: Run) => run.category.slug,
    },
});

const rows: Run[] = game.value.stats.getMostContested();

const options: TableOptions = {
    rowsPerPage: ref('8'),
};

const selectedCategory = computed((): Category => {
    return game.value.getCategory(filterDropdowns.categorySlug);
});

const table = useTable(rows, options, filters, filterDropdowns);
</script>

<style scoped>
.cup-row {
    margin-top: 30px;
}

.displayName {
    font-size: 14px;
}

select {
    float: right;
}
.end-row {
    border-bottom: 1px dashed lightgrey;
}

.title {
    margin-top: 5px;
    margin-bottom: 15px;
}
</style>
