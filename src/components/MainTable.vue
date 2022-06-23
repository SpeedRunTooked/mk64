<template>
    <div class="section-container mx-auto">
        <div class="row filter-row">
            <div class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.trackSlug"
                    @change="resetRows()"
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
            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.recordType"
                    @change="resetRows()"
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

            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.userId"
                    @change="resetRows()"
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
            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.entryStatus"
                    @change="resetRows()"
                >
                    <option value="" selected>All Times</option>
                    <option value="current">Current Records</option>
                    <option value="improvements">Record Improvements</option>
                </select>
            </div>
            <div class="col-1 red" v-if="filterOn">
                <span
                    @click="resetFilters()"
                    class="material-symbols-outlined clickable"
                >
                    filter_list_off
                </span>
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
        <div
            class="row time-row"
            v-for="time in activeRows"
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
                <br />

                {{ moment(time.created).fromNow() }}
            </div>
            <div
                class="col-3 clickable"
                @click="setFilter('trackSlug', time.trackSlug)"
            >
                {{ data.getTrackName(time.trackSlug) }}
            </div>
            <div
                class="col-2 clickable"
                @click="setFilter('recordType', time.recordType)"
            >
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
            <div
                class="col-2 clickable"
                @click="setFilter('userId', time.userId)"
            >
                {{ time.userDisplayName }}
            </div>
            <div class="col-2 break-all">
                {{ time.note }}
            </div>
        </div>
        <div class="row">
            <div class="col"><table-nav></table-nav></div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import TableNav from '@/components/TableNav.vue';
import AbstractTable from '@/components/AbstractTable.vue';

export default {
    extends: AbstractTable,
    components: { TableNav },
    data() {
        return {
            entries: 5,
            filters: {
                trackSlug: '',
                recordType: '',
                userId: '',
                entryStatus: '',
            },
            moment,
        };
    },
    computed: {
        ...mapState(['data']),
        filterOn() {
            return (
                this.filters.trackSlug ||
                this.filters.recordType ||
                this.filters.userId ||
                this.filters.entryStatus
            );
        },
        rows() {
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
        resetFilters() {
            for (const filter in this.filters) {
                this.filters[filter] = '';
            }
            this.resetRows();
        },
        setFilter(filterId, filterValue) {
            this.filters[filterId] = filterValue;
            this.resetRows();
        },
        resetRows() {
            this.currentRow = 0;
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
    width: 700px;
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
    margin-bottom: 10px;
}

.material-symbols-outlined {
    margin-top: 3px;
}
</style>
