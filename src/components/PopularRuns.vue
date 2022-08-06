<script setup lang="ts">
import { useStore } from 'vuex';
import { Game } from '@/game/Game';
import { Category } from '@/game/Category';
import TableNav from '@/components/TableNav.vue';
import { MostPlayedSubcategory } from '@/game/GameStats';
import { reactive, ref, computed } from '@vue/reactivity';
import { TableOptions, useTable } from '@/composables/useTable';

const game = computed<Game>(() => useStore().state.game);

const filterDropdowns = reactive({
    categorySlug: 'DEFAULT_CATEGORY',
});

const filters = reactive({
    category: {
        value: computed(() => filterDropdowns.categorySlug),
        getFilterValue: (mostPlayed: MostPlayedSubcategory) =>
            mostPlayed.category.slug,
    },
});

const rows: MostPlayedSubcategory[] =
    game.value.stats.getMostPlayedSubcategories();

const options: TableOptions = {
    rowsPerPage: ref('8'),
};

const selectedCategory = computed((): Category => {
    return game.value.getCategory(filterDropdowns.categorySlug);
});

const table = useTable(rows, options, filters, filterDropdowns);
</script>

<template>
    <div v-if="selectedCategory" class="stats-table">
        <div class="row section-header">
            <div class="col title">Most Popular Runs</div>
        </div>
        <div class="row">
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="filterDropdowns.categorySlug"
                        @change="table.goToFirstPage()"
                    >
                        <option selected value="DEFAULT_CATEGORY">
                            All Categories
                        </option>
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
            <div class="col category-header">Uploaded Runs</div>
        </div>
        <div
            v-for="run in table.activeRows.value"
            :key="run.category.slug + ':' + run.subcategory.slug"
            class="row subcategory-row"
        >
            <div class="col">{{ run.subcategory.name }}</div>
            <div class="col">
                {{ run.attempts }}
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
                    :table="table"
                    :hide-text-display="true"
                    :hide-fast-arrows="true"
                ></table-nav>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section-header {
    margin-bottom: 0;
}

.category-header {
    margin-top: 20px;
}
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
