<template>
    <div class="section-container mx-auto">
        <div class="row section-header">
            <div class="col-5">Recent Times</div>
            <div class="col-5 align-end">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="filters.entryStatus"
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
                <div class="select-wrapper entries">
                    <select class="form-select" v-model="filters.rows">
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
            v-for="entry in recentEntries"
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
            <div class="col-2" :title="getNote(entry)">
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
import _ from 'lodash';
import moment from 'moment';
import { Game } from '@/game/Game';
import { Entry } from '@/game/Entry';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    data() {
        return {
            filters: {
                entryStatus: '',
                rows: 5,
            },
            moment,
        };
    },

    computed: {
        game(): Game {
            return this.$store.state.game;
        },

        recentEntries(): Entry[] {
            let entries = this.game.getRecentEntries();
            if (this.filters.entryStatus) {
                if (this.filters.entryStatus === 'improvements') {
                    entries = _.filter(entries, (entry) => {
                        return entry.isRecordImprovement === true;
                    });
                }
                if (this.filters.entryStatus === 'current') {
                    entries = _.filter(entries, (entry) => {
                        return entry.isCurrentRecord === true;
                    });
                }
            }
            return entries.splice(0, this.filters.rows);
        },
    },

    methods: {
        linkPresent(entry: Entry): boolean {
            return entry.link.substr(0, 4) === 'http';
        },

        getNote(entry: Entry): string {
            return entry.note || 'Empty note';
        },
    },
});
</script>

<style scoped>
select {
    float: right;
}

.entries {
    width: 70px;
    float: right;
    height: 50px;
}
</style>
