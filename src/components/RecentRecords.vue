<template>
    <div class="section-container mx-auto">
        <div class="row">
            <div class="col section-header">Recent Records</div>
            <div class="col align-end">
                <div class="select-wrapper">
                    <select class="form-select" v-model="entries">
                        <option value="5" selected>5</option>
                        <option value="10" selected>10</option>
                        <option value="15" selected>15</option>
                        <option value="20" selected>20</option>
                    </select>
                </div>
            </div>
        </div>
        <div
            class="row time-row"
            v-for="time in recentTimes"
            :key="time.created"
        >
            <div class="col-2">
                {{ time.created.toLocaleDateString() }}
            </div>
            <div class="col-4">
                {{ data.getTrackName(time.trackSlug) }}
            </div>
            <div class="col-2">
                {{ data.getRecordType(time.recordType) }}
            </div>
            <div class="col-2" :title="getNote(time)">
                <div v-if="linkPresent(time.link)">
                    <a :href="time.link" target="_blank">{{
                        time.timeElapsed
                    }}</a>
                </div>
                <div v-else>
                    {{ time.timeElapsed }}
                </div>
            </div>
            <div class="col-2">
                {{ time.userDisplayName }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
    data() {
        return {
            entries: 5,
        };
    },
    computed: {
        ...mapState(['data']),
        recentTimes() {
            const times = this.data.times.filter(
                (x) => x.isCurrentRecord === true,
            );
            return _.orderBy(times, ['created'], ['desc']).splice(
                0,
                this.entries,
            );
        },
    },
    methods: {
        linkPresent(link) {
            return link.substr(0, 4) === 'http';
        },
        getNote(time) {
            return time.note || 'Empty note';
        },
    },
};
</script>

<style scoped>
select {
    /* width: 150px; */
    float: right;
}
.select-wrapper {
    width: 70px;
    float: right;
    height: 50px;
}
.time-row {
    padding: 2px;
}
</style>
