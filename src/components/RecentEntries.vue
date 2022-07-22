<script lang="ts" setup>
import moment from 'moment';
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { Game } from '@/game/Game';
import { Entry } from '@/game/Entry';
import { ref, computed } from '@vue/reactivity';
import { useHelpers } from '@/composables/useHelpers';
import { TableOptions, useTable } from '@/composables/useTable';

const game = computed<Game>(() => useStore().state.game);

const helpers = useHelpers();

const filterDropdowns = reactive({
    entryStatus: '',
});

const rowsPerPageDropdown = ref('5');

const filters = reactive({
    isCurrentRecord: {
        value: computed(() => filterDropdowns.entryStatus === 'current'),
        getFilterValue: (entry: Entry) => entry.isCurrentRecord,
    },
    isRecordImprovement: {
        value: computed(() => filterDropdowns.entryStatus === 'improvements'),
        getFilterValue: (entry: Entry) => entry.isRecordImprovement,
    },
});

const options: TableOptions = {
    rowsPerPage: rowsPerPageDropdown,
};

const rows = game.value.getRecentEntries();

const { activeRows, emptyRows } = useTable(
    rows,
    options,
    filters,
    filterDropdowns,
);
const { linkPresent } = useHelpers();
</script>

<template>
    <div class="section-container mx-auto">
        <div class="row section-header">
            <div class="col-5">Recent Times</div>
            <div class="col-5 align-end">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="filterDropdowns.entryStatus"
                    >
                        <option value="" selected>All Entries</option>
                        <option value="current">Current Records</option>
                        <option value="improvements">
                            Record Improvements
                        </option>
                    </select>
                </div>
            </div>

            <div class="col align-end">
                <div class="select-wrapper">
                    <select class="form-select" v-model="rowsPerPageDropdown">
                        <option value="5" selected>5</option>
                        <option value="10" selected>10</option>
                        <option value="15" selected>15</option>
                        <option value="20" selected>20</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-3 category-header">Date</div>
            <div class="col-2 category-header">Category</div>
            <div class="col-3 category-header">Subcategory</div>
            <div class="col-2 category-header">
                {{ helpers.getGameDefaultEntryTypeText(game) }}
            </div>
            <div class="col-2 category-header">Player</div>
        </div>

        <div
            class="row subcategory-row"
            v-for="entry in activeRows"
            :key="entry.id"
            :class="{ highlight: entry.isCurrentRecord }"
        >
            <div class="col-3">
                {{ moment(entry.created).fromNow() }}
            </div>

            <div class="col-2">
                {{ entry.category.name }}
            </div>
            <div class="col-3">
                {{ entry.subcategory.name }}
            </div>
            <div class="col-2" :title="entry.note || 'Empty Note'">
                <div v-if="linkPresent(entry.link)">
                    <a :href="entry.link" target="_blank">{{
                        entry.formattedScore
                    }}</a>
                </div>
                <div v-else>
                    {{ entry.formattedScore }}
                </div>
            </div>
            <div class="col-2">
                {{ game.getUser(entry.userId)?.displayName }}
            </div>
        </div>
        <div
            v-for="index in emptyRows"
            :key="index"
            class="row subcategory-row"
        >
            <div class="col-3">-</div>
            <div class="col-2">-</div>
            <div class="col-3">-</div>
            <div class="col-2">-</div>
            <div class="col-2">-</div>
        </div>
    </div>
</template>

<style scoped>
select {
    float: right;
}

.subcategory-row {
    border-bottom: 1px dashed lightgrey;
    padding: 10px 0;
}
</style>
