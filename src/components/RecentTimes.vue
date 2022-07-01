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
                    <select class="form-select" v-model="filters.entries">
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
            v-for="time in recentTimes"
            :key="time.id"
            :class="{ highlight: time.isCurrentRecord }"
        >
            <div class="col-3">
                {{ moment(time.created).fromNow() }}
            </div>

            <div class="col-2">
                {{ time.category.name }}
            </div>
            <div class="col-3">
                {{ time.subcategory.name }}
            </div>
            <div class="col-2" :title="getNote(time)">
                <div v-if="linkPresent(time)">
                    <a :href="time.link" target="_blank">{{
                        time.timeElapsed
                    }}</a>
                </div>
                <div v-else>
                    {{ time.timeElapsed }}
                </div>
            </div>
            <div class="col-2">
                {{ time.user.displayName }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import moment from 'moment';
import { Game } from '@/game/Game';
import { Time } from '@/game/Time';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    data() {
        return {
            filters: {
                entryStatus: '',
                entries: 5,
            },
            moment,
        };
    },

    computed: {
        game(): Game {
            return this.$store.state.game;
        },

        recentTimes(): Time[] {
            let times = this.game.getRecentEntries();
            if (this.filters.entryStatus) {
                if (this.filters.entryStatus === 'improvements') {
                    times = _.filter(times, (x) => {
                        return x.isRecordImprovement === true;
                    });
                }
                if (this.filters.entryStatus === 'current') {
                    times = _.filter(times, (x) => {
                        return x.isCurrentRecord === true;
                    });
                }
            }
            return times.splice(0, this.filters.entries);
        },
    },

    methods: {
        linkPresent(time: Time): boolean {
            return time.link.substr(0, 4) === 'http';
        },

        getNote(time: Time): string {
            return time.note || 'Empty note';
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
