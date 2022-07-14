<template>
    <div class="section-container mx-auto">
        <div class="row section-header">
            <div class="col-5">Recent Times</div>
            <div class="col-5 align-end">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="entryStatus"
                    >
                        <option value="" selected>All Times</option>
                        <option value="current">Current Records</option>
                        <option value="improvements">
                            Record Improvements
                        </option>
                    </select>
                </div>
            </div>

            <div class="col align-end">
                <div class="select-wrapper">
                    <select class="form-select" v-model="options.rowsPerPage">
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
            <div class="col-2 category-header">Time</div>
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
                <div v-if="linkPresent(entry)">
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
    </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Game } from '@/game/Game';
import { Entry } from '@/game/Entry';
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { computed } from '@vue/reactivity';
import { useTable } from '@/composables/useTable';

export default defineComponent({
    setup() {
        const game = computed<Game>(() => useStore().state.game);
        const rows = game.value.getRecentEntries();
        const entryStatus = ref('');

        const options = reactive({
            booleanFilters: {
                isCurrentRecord: computed(
                    () => entryStatus.value === 'current',
                ),
                isRecordImprovement: computed(
                    () => entryStatus.value === 'improvements',
                ),
            },
            rowsPerPage: 5,
        });

        return {
            game,
            moment,
            options,
            entryStatus,
            ...useTable(rows, options),
        };
    },

    methods: {
        linkPresent(entry: Entry): boolean {
            return entry.link.substr(0, 4) === 'http';
        },
    },
});
</script>

<style scoped>
select {
    float: right;
}
</style>
