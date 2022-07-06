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
                <span class="larger-text">{{ currentRecord.timeElapsed }}</span>
                by
                {{ currentRecord.user.displayName }}
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
                {{ oldRecord.time }}
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
            const oldRecordCategory = this.game?.stats?.oldRecords.find(
                (oldRecord) =>
                    oldRecord.categorySlug === this.selectedCategorySlug,
            );

            return (
                oldRecordCategory?.subcategoryRecords?.find(
                    (subcategoryRecord: OldRecordSubcategoryEntry) =>
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
                (category: OldRecordCategoryEntry) =>
                    this.game.getCategory(category.categorySlug),
            );
        },
        getSubcategories() {
            return this.selectedCategory.subcategories;
        },
        getOldRecordKey(oldRecord: OldRecordTimeEntry) {
            return oldRecord.date + oldRecord.time;
        },
        oldRecordSlowerThanCurrent(oldRecord: OldRecordTimeEntry) {
            const oldTimeMs = Time.elapsedTimeToMs(oldRecord.time);
            return oldTimeMs > this.currentRecord.timeMs;
        },
        getTimeDifference(oldRecord: OldRecordTimeEntry) {
            const oldTimeMs = Time.elapsedTimeToMs(oldRecord.time);
            if (oldTimeMs > this.currentRecord.timeMs) {
                return (
                    '+' +
                    Time.msToElapsedTime(oldTimeMs - this.currentRecord.timeMs)
                );
            } else {
                return (
                    '-' +
                    Time.msToElapsedTime(this.currentRecord.timeMs - oldTimeMs)
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

.filter-row {
    margin-bottom: 30px;
}

.current-record {
    margin-top: 2px;
}

.larger-text {
    font-size: 20px;
    margin-right: 10px;
}
</style>
