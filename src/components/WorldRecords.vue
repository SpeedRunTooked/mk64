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
                        v-model="filterDropdowns.categorySlug"
                        @change="table.goToFirstPage()"
                    >
                        <option
                            v-for="category in categories"
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
                        v-model="filterDropdowns.subcategorySlug"
                        @change="table.goToFirstPage()"
                    >
                        <option
                            v-for="subcategory in subcategories"
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
            v-for="oldRecord in table.activeRows.value"
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
                <table-nav :table="table" :hide-text-display="true"></table-nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useStore } from 'vuex';
import { Game } from '@/game/Game';
import { Time } from '@/game/Time';
import { Entry } from '@/game/Entry';
import { Category } from '@/game/Category';
import { ref, reactive, computed } from 'vue';
import { Subcategory } from '@/game/Subcategory';
import TableNav from '@/components/TableNav.vue';
import { OldRecordScoreJSON } from 'FirebaseTypes';
import { TableOptions, useTable } from '@/composables/useTable';

export interface OldRecordRow {
    categorySlug: string;
    subcategorySlug: string;
    date: string;
    score: string;
}

const filterDropdowns = reactive({
    categorySlug: '3lap',
    subcategorySlug: 'luigiraceway',
});

const filters = reactive({
    category: {
        value: computed(() => filterDropdowns.categorySlug),
        getFilterValue: (oldRecord: OldRecordRow) => oldRecord.categorySlug,
    },
    subcategory: {
        value: computed(() => filterDropdowns.subcategorySlug),
        getFilterValue: (oldRecord: OldRecordRow) => oldRecord.subcategorySlug,
    },
});

const options: TableOptions = {
    rowsPerPage: ref('12'),
};

const game = computed<Game>(() => useStore().state.game);

const selectedCategory = computed((): Category => {
    return game.value.getCategory(filterDropdowns.categorySlug);
});

const currentRecord = computed((): Entry => {
    return game.value.getRecord(
        filterDropdowns.categorySlug,
        filterDropdowns.subcategorySlug,
    );
});

const categories = computed(() =>
    _.orderBy(game.value.stats.getOldRecordCategories(), ['name']),
);

const subcategories = computed((): Subcategory[] => {
    return game.value.getSubcategories(selectedCategory.value.slug, true);
});

const rows = buildOldRecordRows();

const getOldRecordKey = (oldRecord: OldRecordScoreJSON) => {
    return oldRecord.date + oldRecord.score;
};

const oldRecordSlowerThanCurrent = (oldRecord: OldRecordScoreJSON) => {
    const oldTimeMs = Time.elapsedTimeToMs(oldRecord.score);
    return oldTimeMs > currentRecord.value.score;
};

const getTimeDifference = (oldRecord: OldRecordScoreJSON) => {
    const oldTimeMs = Time.elapsedTimeToMs(oldRecord.score);
    if (oldTimeMs > currentRecord.value.score) {
        return (
            '+' + Time.msToElapsedTime(oldTimeMs - currentRecord.value.score)
        );
    } else {
        return (
            '-' + Time.msToElapsedTime(currentRecord.value.score - oldTimeMs)
        );
    }
};

const table = useTable(rows, options, filters, filterDropdowns);

// - - - Private functions - - - //

function buildOldRecordRows(): OldRecordRow[] {
    const result: OldRecordRow[] = [];
    for (const run of game.value.stats.runs) {
        if (run.oldRecords) {
            for (const oldRecord of run.oldRecords) {
                result.push({
                    categorySlug: run.category.slug,
                    subcategorySlug: run.subcategory.slug,
                    score: oldRecord.score,
                    date: oldRecord.date,
                });
            }
        }
    }
    return result;
}
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
