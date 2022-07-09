<template>
    <div v-if="selectedCategory" class="stats-table mx-auto">
        <div class="row section-header">
            <div class="col title">World Record Comparisons</div>
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
                        <option
                            v-for="category in getCategories()"
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
                        v-model="selectedSubcategorySlug"
                        @change="goToFirstPage()"
                    >
                        <option
                            v-for="subcategory in getSubcategories()"
                            :key="subcategory.slug"
                            :value="subcategory.slug"
                        >
                            {{ subcategory.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="col current-record highlight" v-if="currentRecord">
                <span class="larger-text">{{
                    currentRecord.formattedScore
                }}</span>
                by
                {{ game.getUser(currentRecord.userId).displayName }}
            </div>
        </div>
        <div class="row">
            <div class="col category-header">World Record Date</div>
            <div class="col category-header">World Record Time</div>
            <div class="col category-header">Time Difference</div>
        </div>
        <div
            v-for="oldRecord in activeRows"
            :key="getOldRecordKey(oldRecord)"
            class="row subcategory-row"
            :class="oldRecordSlowerThanCurrent(oldRecord) ? 'highlight' : ''"
        >
            <div class="col">{{ oldRecord.date }}</div>
            <div class="col">
                {{ oldRecord.score }}
            </div>
            <div class="col">
                {{ getTimeDifference(oldRecord) }}
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
    OldRecordCategoryJSON,
    OldRecordSubcategoryJSON,
    OldRecordScoreJSON,
} from 'FirebaseTypes';
import { Entry } from '@/game/Entry';
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

        activeRows(): OldRecordScoreJSON[] {
            return this.getActiveRows();
        },

        currentRecord(): Entry {
            return this.game.getRecord(
                this.selectedCategorySlug,
                this.selectedSubcategorySlug,
            );
        },

        rows(): OldRecordScoreJSON[] {
            const oldRecordCategory = this.game?.stats?.oldRecords.find(
                (oldRecord) =>
                    oldRecord.categorySlug === this.selectedCategorySlug,
            );

            return (
                oldRecordCategory?.subcategoryRecords?.find(
                    (subcategoryRecord: OldRecordSubcategoryJSON) =>
                        subcategoryRecord.subcategorySlug ===
                        this.selectedSubcategorySlug,
                )?.records || []
            );
        },

        selectedCategory(): Category {
            return this.game.getCategory(this.selectedCategorySlug);
        },
    },

    methods: {
        getCategories() {
            return this.game.stats.oldRecords.map(
                (category: OldRecordCategoryJSON) =>
                    this.game.getCategory(category.categorySlug),
            );
        },
        getSubcategories() {
            return this.selectedCategory.subcategories;
        },
        getOldRecordKey(oldRecord: OldRecordScoreJSON) {
            return oldRecord.date + oldRecord.score;
        },
        oldRecordSlowerThanCurrent(oldRecord: OldRecordScoreJSON) {
            const oldTimeMs = Time.elapsedTimeToMs(oldRecord.score);
            return oldTimeMs > this.currentRecord.score;
        },
        getTimeDifference(oldRecord: OldRecordScoreJSON) {
            const oldTimeMs = Time.elapsedTimeToMs(oldRecord.score);
            if (oldTimeMs > this.currentRecord.score) {
                return (
                    '+' +
                    Time.msToElapsedTime(oldTimeMs - this.currentRecord.score)
                );
            } else {
                return (
                    '-' +
                    Time.msToElapsedTime(this.currentRecord.score - oldTimeMs)
                );
            }
        },
    },
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

.current-record {
    margin-top: 2px;
}

.larger-text {
    font-size: 20px;
    margin-right: 10px;
}
</style>
