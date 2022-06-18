<template>
    <div class="section-container mx-auto">
        <div class="row filter-row">
            <div class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.trackSlug"
                >
                    <!-- <option value="" disabled selected>Select Track</option> -->
                    <option value="">All Tracks</option>

                    <optgroup
                        v-for="(cup, key) in data.cups"
                        :label="cup.name"
                        :key="key"
                    >
                        <option
                            v-for="(track, key) in cup.tracks"
                            :key="key"
                            :value="track.slug"
                        >
                            {{ track.name }}
                        </option>
                    </optgroup>
                </select>
            </div>
            <div class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.recordType"
                >
                    <!-- <option value="" disabled selected>Record Type</option> -->
                    <option value="">All Categories</option>

                    <option
                        v-for="(type, key) in data.recordtypes"
                        :value="type.slug"
                        :key="key"
                    >
                        {{ type.name }}
                    </option>
                </select>
            </div>

            <div class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.userId"
                >
                    <!-- <option value="" disabled selected>
                                Select Player
                            </option> -->
                    <option value="">All Players</option>

                    <option
                        v-for="(value, key) in data.users"
                        :key="key"
                        :value="key"
                    >
                        {{ value.displayName }}
                    </option>
                    <!-- </li> -->
                </select>
            </div>
            <div class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.entryStatus"
                >
                    <option value="" selected>All Times</option>
                    <option value="current">Current Records</option>
                    <option value="improvements">Record Improvements</option>
                </select>
            </div>
        </div>
        <div class="row header-row bold">
            <div class="col-2">Date Recorded</div>
            <div class="col-3">Track</div>
            <div class="col-2">Category</div>
            <div class="col-1">Time</div>
            <div class="col-2">Player</div>
            <div class="col-2">Notes</div>
        </div>
        <!-- <div class="row">
            <div class="col subheader">
                Current records in <span class="bold">bold</span>
            </div>
        </div> -->
        <div
            class="row time-row"
            v-for="time in filteredData"
            :key="time.created"
            :class="{ highlight: time.isCurrentRecord }"
        >
            <div class="col-2">
                {{
                    time.created.toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                    })
                }}

                {{ time.created.toLocaleTimeString() }}
            </div>
            <div class="col-3">
                {{ data.getTrackName(time.trackSlug) }}
            </div>
            <div class="col-2">
                {{ data.getRecordType(time.recordType) }}
            </div>
            <div class="col-1" :title="getNote(time)">
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
            <div class="col-2">
                {{ time.note }}
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
            filters: {
                trackSlug: '',
                recordType: '',
                userId: '',
                entryStatus: '',
            },
        };
    },
    computed: {
        ...mapState(['data']),
        filteredData() {
            let times = this.data.times;

            if (this.filters.trackSlug) {
                times = _.filter(times, (x) => {
                    return x.trackSlug === this.filters.trackSlug;
                });
            }

            if (this.filters.recordType) {
                times = _.filter(times, (x) => {
                    return x.recordType === this.filters.recordType;
                });
            }

            if (this.filters.userId) {
                times = _.filter(times, (x) => {
                    return x.userId === this.filters.userId;
                });
            }

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

            return _.orderBy(times, ['created'], ['desc']);
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
</style>
<style scoped>
.time-row {
    padding: 2px;
}

.section-container {
    width: 800px;
}

.filter-row {
    margin-bottom: 20px;
}

.time-row {
    border-top: 1px solid lightgrey;
    padding: 10px;
}

.subheader {
    padding: 5px;
}
.header-row {
    margin-top: 25px;
    margin-bottom: 5px;
}
</style>
