<template>
    <div v-if="selectedCategory" class="stats-table mx-auto">
        <div class="row section-header">
            <div class="col title">Comparison to World Records</div>
        </div>
        <div class="row filter-row">
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="selectedCategorySlug"
                        @change="goToFirstPage()"
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
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="selectedCategorySlug"
                        @change="goToFirstPage()"
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
            <div class="col current-record">
                {{ currentRecord.timeElapsed }} by
                {{ currentRecord.user.displayName }}
            </div>
        </div>
        <div class="row">
            <div class="col category-header">World Record Date</div>
            <div class="col category-header">World Record Time</div>
        </div>
        <div
            v-for="oldRecord in activeRows"
            :key="oldRecord.date"
            class="row subcategory-row"
        >
            <div class="col">{{ oldRecord.date }}</div>
            <div class="col">
                {{ oldRecord.time }}
            </div>
        </div>
        <div v-for="row in emptyRows" :key="row.id" class="row subcategory-row">
            <div class="col">-</div>
            <div class="col">-</div>
        </div>
        <div class="row">
            <div class="col">
                <table-nav :show-text-display="false"></table-nav>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Game } from '@/game/Game';
import { Category } from '@/game/Category';
import { defineComponent } from '@vue/composition-api';
import AbstractTableVue from './AbstractTable.vue';
import TableNav from '@/components/TableNav.vue';
import {
    OldRecordCategoryEntry,
    OldRecordSubcategoryEntry,
    OldRecordTimeEntry,
} from 'FirebaseTypes';
import { Time } from '@/game/Time';

export default defineComponent({
    extends: AbstractTableVue,
    components: { TableNav },
    data() {
        return {
            selectedCategorySlug: '3lap',
            selectedSubcategorySlug: 'luigiraceway',
            rowsPerPage: 12,
        };
    },

    computed: {
        game(): Game {
            return this.$store.state.game;
        },

        activeRows(): OldRecordTimeEntry[] {
            return this.getActiveRows();
        },

        currentRecord(): Time {
            return this.game.getRecord(
                this.selectedCategorySlug,
                this.selectedSubcategorySlug,
            );
        },

        rows(): OldRecordTimeEntry[] {
            const oldRecordCategory = this.game.stats.oldRecords.find(
                (oldRecord) =>
                    oldRecord.categorySlug === this.selectedCategorySlug,
            );

            return (
                oldRecordCategory?.subcategoryRecords?.find(
                    (subcategoryRecord: OldRecordSubcategoryEntry) =>
                        subcategoryRecord.subcategorySlug,
                )?.records || []
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

.filter-row {
    margin-bottom: 30px;
}

.current-record {
    margin-top: 5px;
}
</style>
