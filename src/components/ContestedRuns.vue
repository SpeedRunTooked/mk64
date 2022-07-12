<template>
    <div v-if="selectedCategory" class="stats-table mx-auto">
        <div class="row section-header">
            <div class="col title">Most Contested</div>
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="selectedCategorySlug"
                        @change="goToFirstPage()"
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
            v-for="run in activeRows"
            :key="run.subcategory.slug"
            class="row subcategory-row"
        >
            <div class="col">{{ run.subcategory.name }}</div>
            <div class="col">
                {{ run.timesContested }}
            </div>
        </div>
        <div
            v-for="index in emptyRows"
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
                    :nextPageExists="nextPageExists"
                    :goToNextPage="goToNextPage"
                    :previousPageExists="previousPageExists"
                    :goToPreviousPage="goToPreviousPage"
                    :goToLastPage="goToLastPage"
                    :goToFirstPage="goToFirstPage"
                    :firstRow="firstRow"
                    :lastRow="lastRow"
                    :totalRows="totalRows"
                ></table-nav>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Run } from '@/game/Run';
import { Game } from '@/game/Game';
import { defineComponent } from 'vue';
import { Category } from '@/game/Category';
import TableNav from '@/components/TableNav.vue';
import AbstractTableVue from './AbstractTable.vue';

export default defineComponent({
    extends: AbstractTableVue,
    components: { TableNav },
    data() {
        return {
            selectedCategorySlug: '3lap',
            rowsPerPage: 8,
        };
    },

    computed: {
        game(): Game {
            return this.$store.state.game;
        },

        activeRows(): Run[] {
            return this.getActiveRows();
        },

        rows(): Run[] {
            return this.game.stats
                .getMostContested()
                .filter(
                    (run) => run.category.slug === this.selectedCategorySlug,
                );
        },

        selectedCategory(): Category {
            return this.game.getCategory(this.selectedCategorySlug);
        },
    },

    methods: {},
});
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
