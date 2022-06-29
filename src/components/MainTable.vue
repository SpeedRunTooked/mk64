<template>
    <div class="section-container mx-auto">
        <div class="row filter-row">
            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.category"
                    @change="resetRows()"
                >
                    <option value="null">All Categories</option>

                    <option
                        v-for="(category, key) in game.categories"
                        :value="category"
                        :key="key"
                    >
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <div v-if="filters.category" class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.subcategory"
                    @change="resetRows()"
                >
                    <option value="null">All {{ subcategoryName }}s</option>

                    <option
                        v-for="subcategory in filterSets.subcategorySet"
                        :key="subcategory.slug"
                        :value="subcategory"
                    >
                        {{ subcategory.name }}
                    </option>
                </select>
            </div>

            <div v-if="!filters.category" class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    disabled
                >
                    <option value="">
                        {{
                            filters.category
                                ? subcategory.name
                                : 'Select a category'
                        }}
                    </option>
                </select>
            </div>

            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.user"
                    @change="resetRows()"
                >
                    <option value="null">All Players</option>

                    <option
                        v-for="(value, key) in game.users"
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
                    <option value="null" selected>All Times</option>
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
            <div class="col-3">Recorded</div>
            <div class="col-2">Category</div>
            <div class="col-3">{{ subcategoryName }}</div>
            <div class="col-1">Time</div>
            <div class="col-3">Player</div>
        </div>
        <div
            class="row time-row"
            v-for="time in activeRows"
            :key="time.created"
            :class="{ highlight: time.isCurrentRecord }"
            :title="getNote(time)"
        >
            <div class="col-3">
                {{ moment(time.created).fromNow() }}
            </div>
            <div
                class="col-2 clickable"
                @click="setFilter('category', time.category)"
            >
                {{ time.category.name }}
            </div>
            <div
                class="col-3 clickable"
                @click="setFilter('subcategory', time.subcategory)"
            >
                {{ time.subcategory.name }}
            </div>
            <div class="col-1">
                <div v-if="linkPresent(time.link)">
                    <a :href="time.link" target="_blank">{{
                        time.timeElapsed
                    }}</a>
                </div>
                <div v-else>
                    {{ time.timeElapsed }}
                </div>
            </div>
            <div class="col-3 clickable" @click="setFilter('user', time.user)">
                {{ time.userDisplayName }}
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
                subcategory: null,
                category: null,
                user: null,
                entryStatus: null,
            },

            moment,
        };
    },
    computed: {
        ...mapState(['game']),
        filterOn() {
            return (
                this.filters.subcategory ||
                this.filters.category ||
                this.filters.user ||
                this.filters.entryStatus
            );
        },
        filterSets() {
            const subcategorySet = this.game.categories.find(
                (x) => x.slug === this.filters.category.slug,
            ).subcategories;
            return {
                subcategorySet: _.orderBy(subcategorySet, ['name']),
            };
        },
        subcategoryName() {
            if (this.filters.category) {
                return this.filters.category.subcategoryName;
            }
            return 'Subcategory';
        },
        rows() {
            let times = this.game.times;

            if (this.filters.subcategory) {
                times = _.filter(times, (x) => {
                    return x.subcategory.slug === this.filters.subcategory.slug;
                });
            }

            if (this.filters.category) {
                times = _.filter(times, (x) => {
                    return x.category.slug === this.filters.category.slug;
                });
            }

            if (this.filters.user) {
                times = _.filter(times, (time) => {
                    return time.user.id === this.filters.user.id;
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
                this.filters[filter] = null;
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

.section-container {
    width: 700px;
}

.filter-row {
    margin-bottom: 20px;
}

.time-row {
    border-bottom: 1px dashed lightgrey;
    padding: 20px 0;
}

.subheader {
    padding: 5px;
}
.header-row {
    margin-top: 25px;
    padding-bottom: 10px;
    border-bottom: 2px solid lightgrey;
}

.material-symbols-outlined {
    margin-top: 3px;
}
</style>
