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
                    <option value="">All Categories</option>

                    <option
                        v-for="(category, key) in game.categories"
                        :value="category.slug"
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
                    <option value="">All {{ subcategoryName }}s</option>

                    <option
                        v-for="subcategory in subcategoryFilterSet"
                        :key="subcategory.slug"
                        :value="subcategory.slug"
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
                            filters.subcategory
                                ? game.getSubcategory(filters.subcategory)?.name
                                : ''
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
                    v-if="game.users.length > 0"
                >
                    <option value="">All Players</option>

                    <option
                        v-for="(user, key) in game.users"
                        :key="key"
                        :value="user.id"
                        :v-if="game.users.length > 0"
                    >
                        {{ user.displayName }}
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
            <div class="col-3">Recorded</div>
            <div class="col-2">Category</div>
            <div class="col-3">{{ subcategoryName }}</div>
            <div class="col-1">Time</div>
            <div class="col-3">Player</div>
        </div>
        <div
            class="row time-row"
            v-for="time in activeRows"
            :key="String(time.created)"
            :class="{ highlight: time.isCurrentRecord }"
            :title="getNote(time)"
        >
            <div class="col-3">
                {{ moment(time.created).fromNow() }}
            </div>
            <div
                class="col-2 clickable"
                @click="setFilter('category', time.category.slug)"
            >
                {{ time.category.name }}
            </div>
            <div
                class="col-3 clickable"
                @click="setFilter('subcategory', time.subcategory.slug)"
            >
                {{ time.subcategory.name }}
            </div>
            <div class="col-1">
                <div v-if="linkPresent(time)">
                    <a :href="time.link" target="_blank">{{
                        time.timeElapsed
                    }}</a>
                </div>
                <div v-else>
                    {{ time.timeElapsed }}
                </div>
            </div>
            <div
                class="col-3 clickable"
                @click="setFilter('user', time.user.id)"
            >
                {{ time.user.displayName }}
            </div>
        </div>
        <div class="row">
            <div class="col"><table-nav></table-nav></div>
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import moment from 'moment';
import { mapState } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import TableNav from '@/components/TableNav.vue';
import AbstractTable from '@/components/AbstractTable.vue';
import { Category } from '@/game/Category';
import { Subcategory } from '@/game/Subcategory';
import { Time } from '@/game/Time';
import { reactive, ref } from '@vue/reactivity';

interface MainTableFilters {
    subcategory: string;
    category: string;
    user: string;
    entryStatus: string;
    [key: string]: string;
}

export default defineComponent({
    extends: AbstractTable,
    components: { TableNav },
    setup() {
        const entries = ref(5);
        const filters: MainTableFilters = reactive({
            subcategory: '',
            category: '',
            user: '',
            entryStatus: '',
        });
        return { entries, filters, moment };
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
        subcategoryFilterSet(): Subcategory[] {
            if (this.filters.category) {
                const subcategorySet = this.game.categories.find(
                    (category: Category): boolean => {
                        if (this.filters.category) {
                            return category.slug === this.filters.category;
                        } else {
                            return false;
                        }
                    },
                ).subcategories;
                return _.orderBy(subcategorySet, ['name']);
            }
            return [];
        },
        subcategoryName() {
            if (this.filters.category) {
                return this.game.getSubcategoryDisplayName(
                    this.filters.category,
                );
            }
            return 'Subcategory';
        },
        activeRows(): Time[] {
            return this.getActiveRows();
        },

        rows(): Time[] {
            let times = this.game.times;

            if (this.filters.subcategory) {
                times = _.filter(times, (x) => {
                    return x.subcategory.slug === this.filters.subcategory;
                });
            }

            if (this.filters.category) {
                times = _.filter(times, (x) => {
                    return x.category.slug === this.filters.category;
                });
            }

            if (this.filters.user) {
                times = _.filter(times, (time) => {
                    return time.user.id === this.filters.user;
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
        linkPresent(time: Time) {
            return time.link.substr(0, 4) === 'http';
        },
        getNote(time: Time) {
            return time.note || 'Empty note';
        },
        resetFilters(): void {
            for (const filter in this.filters) {
                this.filters[filter] = '';
            }
            this.resetRows();
        },
        setFilter(filterId: string, filterValue: string) {
            this.filters[filterId] = filterValue;
            this.resetRows();
        },
        resetRows() {
            this.currentRow = 0;
        },
    },
});
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
