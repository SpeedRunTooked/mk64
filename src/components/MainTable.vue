<template>
    <div class="section-container mx-auto">
        <submit-data-modal :formData="formData"></submit-data-modal>
        <div class="row filter-row">
            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.category"
                    @change="goToFirstPage()"
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
                    @change="goToFirstPage()"
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
                    @change="goToFirstPage()"
                    v-if="game.users.length > 0"
                >
                    <option value="">All Players</option>

                    <option
                        v-for="(user, key) in game.users"
                        :key="key"
                        :value="user.id"
                        :v-if="game.users.length > 0"
                    >
                        {{ game.getUser(user.id).displayName }}
                    </option>
                </select>
            </div>
            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filters.entryStatus"
                    @change="goToFirstPage()"
                >
                    <option value="" selected>All Times</option>
                    <option value="current">Current Records</option>
                    <option value="improvements">Record Improvements</option>
                </select>
            </div>
            <div class="col-1 red">
                <span
                    v-if="filterOn"
                    @click="resetFilters()"
                    class="material-symbols-outlined clickable"
                >
                    filter_list_off
                </span>
            </div>
        </div>
        <div class="row header-row bold">
            <div class="col-2">Recorded</div>
            <div class="col-2">Category</div>
            <div class="col-3">{{ subcategoryName }}</div>
            <div class="col-1">Time</div>
            <div class="col-4">
                <div class="row">
                    <div class="col-9">Player</div>
                    <div class="col-3">Ghost</div>
                </div>
            </div>
        </div>
        <div
            class="row entry-row"
            v-for="entry in activeRows"
            :key="entry.id"
            :class="{ highlight: entry.isCurrentRecord }"
            :title="getNote(entry)"
        >
            <div class="col-2">
                {{ moment(entry.created).fromNow() }}
            </div>
            <div
                class="col-2 clickable"
                @click="setFilter('category', entry.category.slug)"
            >
                {{ entry.category.name }}
            </div>
            <div
                class="col-3 clickable"
                @click="setFilter('subcategory', entry.subcategory.slug)"
            >
                {{ entry.subcategory.name }}
            </div>
            <div class="col-1">
                <div v-if="linkPresent(entry)">
                    <a :href="entry.link" target="_blank">{{
                        entry.formattedScore
                    }}</a>
                </div>
                <div v-else>
                    {{ entry.formattedScore }}
                </div>
            </div>
            <div class="col-4">
                <div class="row">
                    <div class="col-9">
                        <span
                            class="clickable"
                            @click="setFilter('user', entry.userId)"
                        >
                            {{ game.getUser(entry.userId).displayName }}</span
                        >
                    </div>
                    <div v-if="!entry.fileAvailable" class="col-3">
                        <span
                            class="material-symbols-outlined clickable add-button"
                            data-bs-toggle="modal"
                            data-bs-target="#submit-data-modal"
                            @click="setFormData(entry)"
                        >
                            add
                        </span>
                    </div>

                    <div v-else class="col-3">
                        <span
                            class="material-symbols-outlined clickable"
                            @click="downloadFile(entry)"
                        >
                            file_download
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-for="index in emptyRows" :key="index" class="row entry-row">
            <div class="col-2">-</div>
            <div class="col-2">-</div>
            <div class="col-3">-</div>
            <div class="col-1">-</div>
            <div class="col-4">
                <div class="row">
                    <div class="col-9">-</div>
                    <div class="col-3">-</div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <table-nav
                    :nextPageExists="nextPageExists"
                    :goToNextPage="goToNextPage"
                    :previousPageExists="previousPageExists"
                    :goToPreviousPage="goToPreviousPage"
                    :goToLastPage="goToLastPage"
                    :goToFirstPage="goToFirstPage"
                    :firstRow="firstRow"
                    :lastRow="lastRow"
                    :totalRows="totalRows"
                ></table-nav>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import moment from 'moment';
import { Entry } from '@/game/Entry';
import { Game } from '@/game/Game';
import TableNav from '@/components/TableNav.vue';
import { Subcategory } from '@/game/Subcategory';
import { defineComponent } from 'vue';
import SubmitDataModal from '@/components/modals/SubmitDataModal.vue';
import { useTable } from '@/composables/useTable';
import { useStore } from 'vuex';
import { computed } from '@vue/reactivity';

interface MainTableFilters {
    subcategory: string;
    category: string;
    user: string;
    entryStatus: string;
    [key: string]: string;
}

export default defineComponent({
    components: { TableNav, SubmitDataModal },

    setup() {
        const game = computed((): Game => useStore().state.game);
        const rows = game.value.entries;
        return { game, ...useTable(rows, { rowsPerPage: 10 }) };
    },

    data() {
        return {
            filters: {
                subcategory: '',
                category: '',
                user: '',
                entryStatus: '',
            },
            formData: {},
            moment,
        };
    },

    computed: {
        filterOn(): boolean {
            return (
                (
                    this.filters.subcategory ||
                    this.filters.category ||
                    this.filters.user ||
                    this.filters.entryStatus
                ).length > 0
            );
        },

        subcategoryFilterSet(): Subcategory[] {
            const subcategorySet = this.game.getCategory(
                this.filters.category,
            ).subcategories;
            return _.orderBy(subcategorySet, ['displayOrder']);
        },

        subcategoryName(): string {
            if (this.filters.category) {
                return this.game.getSubcategoryDisplayName(
                    this.filters.category,
                );
            }
            return 'Subcategory';
        },

        // rows(): Entry[] {
        //     let entries = this.game.entries;

        //     if (this.filters.subcategory) {
        //         entries = _.filter(entries, (entry) => {
        //             return entry.subcategory.slug === this.filters.subcategory;
        //         });
        //     }

        //     if (this.filters.category) {
        //         entries = _.filter(entries, (entry) => {
        //             return entry.category.slug === this.filters.category;
        //         });
        //     }

        //     if (this.filters.user) {
        //         entries = _.filter(entries, (entry) => {
        //             return entry.userId === this.filters.user;
        //         });
        //     }

        //     if (this.filters.entryStatus) {
        //         if (this.filters.entryStatus === 'improvements') {
        //             entries = _.filter(entries, (entry) => {
        //                 return entry.isRecordImprovement === true;
        //             });
        //         }
        //         if (this.filters.entryStatus === 'current') {
        //             entries = _.filter(entries, (entry) => {
        //                 return entry.isCurrentRecord === true;
        //             });
        //         }
        //     }

        //     return _.orderBy(entries, ['created'], ['desc']);
        // },
    },

    methods: {
        setFormData(entry: Entry): void {
            this.formData = entry;
        },

        linkPresent(entry: Entry): boolean {
            return entry.link.substr(0, 4) === 'http';
        },

        getNote(entry: Entry): string {
            return entry.note || 'Empty note';
        },

        resetFilters(): void {
            for (const filter in this.filters) {
                (this.filters as MainTableFilters)[filter] = '';
            }
            this.goToFirstPage();
        },

        setFilter(filter: string, filterValue: string) {
            (this.filters as MainTableFilters)[filter] = filterValue;
            this.goToFirstPage();
        },

        downloadFile(entry: Entry): void {
            this.downloadItem(this.getFileDownloadLink(entry));
        },

        getFileDownloadLink(entry: Entry): string {
            return `https://firebasestorage.googleapis.com/v0/b/mk64-ad77f.appspot.com/o/${process.env.VUE_APP_DATABASE}%2Fmk64%2Ffiles%2F${entry.id}%2FMARIOKART64_Cont_1.mpk?alt=media&token=6557a94f-4fcf-428c-894d-525eb940f2fe`;
        },

        async downloadItem(url: string) {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'MARIOKART64_Cont_1.mpk');
            document.body.appendChild(link);
            link.click();
        },
    },
});
</script>

<style scoped>
select {
    float: right;
}

.add-button {
    font-size: 22px;
}

.select-wrapper {
    width: 70px;
    float: right;
    height: 50px;
}

.entry-row {
    padding: 2px;
}

.section-container {
    width: 700px;
}

.entry-row {
    border-bottom: 1px dashed lightgrey;
    padding: 20px 0;
}

.subheader {
    padding: 5px;
}
.header-row {
    margin-top: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid grey;
}

.material-symbols-outlined {
    margin: -5px 0;
}

.btn-light {
    font-size: 12px;
}
</style>
