<template>
    <div class="section-container mx-auto">
        <div class="row filter-row">
            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.categorySlug"
                    @change="resetRows()"
                >
                    <!-- <option value="" disabled selected>Record Type</option> -->
                    <option value="">All Categories</option>

                    <option
                        v-for="(type, key) in data.categories"
                        :value="type.slug"
                        :key="key"
                    >
                        {{ type.name }}
                    </option>
                </select>
            </div>

            <div v-if="this.filters.categorySlug" class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.subcategorySlug"
                    @change="resetRows()"
                >
                    <option value="">All Subcategories</option>

                    <option
                        v-for="subcategory in filterSets.subcategorySet"
                        :key="subcategory.slug"
                        :value="subcategory.slug"
                    >
                        {{
                            data.getSubcategoryName(
                                this.filters.categorySlug,
                                subcategory.slug,
                            )
                        }}
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
                    <option value="">All Players</option>

                    <option
                        v-for="(value, key) in data.users"
                        :key="key"
                        :value="key"
                    >
                        {{ value.displayName }}
                    </option>
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
            <div class="col-2">Category</div>
            <div class="col-3">Subcategory</div>
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
                class="col-2 clickable"
                @click="setFilter('categorySlug', time.categorySlug)"
            >
                {{ data.getCategoryName(time.categorySlug) }}
            </div>
            <div
                class="col-3 clickable"
                @click="setFilter('subcategorySlug', time.subcategorySlug)"
            >
                {{
                    data.getSubcategoryName(
                        time.categorySlug,
                        time.subcategorySlug,
                    )
                }}
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
                subcategorySlug: '',
                categorySlug: '',
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
                this.filters.subcategorySlug ||
                this.filters.categorySlug ||
                this.filters.userId ||
                this.filters.entryStatus
            );
        },
        filterSets() {
            const subcategorySet = this.data.categories.find(
                (x) => x.slug === this.filters.categorySlug,
            ).subcategories;
            return {
                subcategorySet,
            };
        },
        rows() {
            let times = this.data.times;

            if (this.filters.subcategorySlug) {
                times = _.filter(times, (x) => {
                    return x.subcategorySlug === this.filters.subcategorySlug;
                });
            }

            if (this.filters.categorySlug) {
                times = _.filter(times, (x) => {
                    return x.categorySlug === this.filters.categorySlug;
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
