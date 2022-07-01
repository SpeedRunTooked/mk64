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
            v-for="time in recentTimes()"
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
import { useStore } from 'vuex';
import { Time } from '@/game/Time';
import { reactive } from '@vue/reactivity';
import { defineComponent } from '@vue/composition-api';
import { computed } from '@vue/runtime-core';

export default defineComponent({
    setup() {
        const store = useStore();
        const game = computed(() => store.state.game);
        const filters = reactive({
            entryStatus: '',
            entries: 5,
        });

        const recentTimes = (): Time[] => {
            let times = game.value.getRecentEntries();
            if (filters.entryStatus) {
                if (filters.entryStatus === 'improvements') {
                    times = _.filter(times, (x) => {
                        return x.isRecordImprovement === true;
                    });
                }
                if (filters.entryStatus === 'current') {
                    times = _.filter(times, (x) => {
                        return x.isCurrentRecord === true;
                    });
                }
            }
            return times.splice(0, filters.entries);
        };

        const linkPresent = (time: Time) => {
            return time.link.substr(0, 4) === 'http';
        };

        const getNote = (time: Time) => {
            return time.note || 'Empty note';
        };

        return { filters, moment, game, recentTimes, linkPresent, getNote };
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
