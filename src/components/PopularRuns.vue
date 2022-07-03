<template>
    <div v-if="selectedCategory" class="stats-table mx-auto">
        <div class="row section-header">
            <div class="col title">Popular Runs</div>
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="selectedCategorySlug"
                    >
                        <option value="" selected>All Categories</option>
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
            <div class="col category-header">Time</div>
        </div>
        <div
            v-for="run in activeRows"
            :key="run.subcategory.slug"
            class="row subcategory-row"
        >
            <div class="col">{{ run.subcategory.name }}</div>
            <div class="col">
                {{ run.attempts }}
            </div>
        </div>
        <div v-for="row in emptyRows" :key="row.id" class="row subcategory-row">
            <div class="col">-</div>
            <div class="col">-</div>
        </div>
        <div class="row">
            <div class="col"><table-nav></table-nav></div>
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Game } from '@/game/Game';
import { Category } from '@/game/Category';
import { Subcategory } from '@/game/Subcategory';
import { defineComponent } from '@vue/composition-api';
import { Run } from '@/game/Run';
import AbstractTableVue from './AbstractTable.vue';
import { MostPlayedSubcategory } from '@/game/RunStats';
import TableNav from '@/components/TableNav.vue';

export default defineComponent({
    extends: AbstractTableVue,
    components: { TableNav },
    data() {
        return {
            selectedCategorySlug: '',
            entries: 5,
            rowsPerPage: 8,
        };
    },

    computed: {
        game(): Game {
            return this.$store.state.game;
        },

        activeRows(): MostPlayedSubcategory[] {
            return this.getActiveRows();
        },

        rows(): MostPlayedSubcategory[] {
            return this.game.runStats.getMostPlayedSubcategories(
                this.selectedCategorySlug,
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
}
</style>
