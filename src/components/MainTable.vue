<template>
    <div class="section-container mx-auto">
        <submit-data-modal :formData="formData"></submit-data-modal>
        <div class="row filter-row">
            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filterDropdowns.category"
                    @change="table.goToFirstPage()"
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

            <div v-if="filterDropdowns.category" class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filterDropdowns.subcategory"
                    @change="table.goToFirstPage()"
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

            <div v-if="!filterDropdowns.category" class="col-3">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    disabled
                >
                    <option value="">
                        {{
                            filterDropdowns.subcategory
                                ? game.getSubcategory(
                                      filterDropdowns.subcategory,
                                  )?.name
                                : ''
                        }}
                    </option>
                </select>
            </div>

            <div class="col">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="filterDropdowns.user"
                    @change="table.goToFirstPage()"
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
                    v-model="filterDropdowns.entryStatus"
                    @change="table.goToFirstPage()"
                >
                    <option value="" selected>All Times</option>
                    <option value="current">Current Records</option>
                    <option value="improvements">Record Improvements</option>
                </select>
            </div>
            <div class="col-1 red">
                <span
                    v-if="table.filterOn()"
                    @click="table.resetFilters()"
                    class="material-symbols-outlined clickable filter-icon"
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
            v-for="entry in table.activeRows.value"
            :key="entry.id"
            :class="{ highlight: entry.isCurrentRecord }"
            :title="entry.note"
        >
            <div class="col-2">
                {{ moment(entry.created).fromNow() }}
            </div>
            <div
                class="col-2 clickable"
                @click="table.setFilter('category', entry.category.slug)"
            >
                {{ entry.category.name }}
            </div>
            <div
                class="col-3 clickable"
                @click="table.setFilter('subcategory', entry.subcategory.slug)"
            >
                {{ entry.subcategory.name }}
            </div>
            <div class="col-1">
                <div v-if="helpers.linkPresent(entry.link)">
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
                            @click="table.setFilter('user', entry.userId)"
                        >
                            {{ game.getUser(entry.userId).displayName }}</span
                        >
                    </div>
                    <div v-if="!entry.fileName" class="col-3">
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
        <div
            v-for="index in table.emptyRows.value"
            :key="index"
            class="row entry-row"
        >
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
                <table-nav :table="table"></table-nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import moment from 'moment';
import { useStore } from 'vuex';
import { Game } from '@/game/Game';
import { Entry } from '@/game/Entry';
import { useRoute } from 'vue-router';
import TableNav from '@/components/TableNav.vue';
import { Subcategory } from '@/game/Subcategory';
import { useHelpers } from '@/composables/useHelpers';
import { computed, reactive, ref } from '@vue/reactivity';
import { TableOptions, useTable } from '@/composables/useTable';
import SubmitDataModal from '@/components/modals/SubmitDataModal.vue';

const game = computed((): Game => useStore().state.game);
const rows = game.value.entries;

const route = useRoute();
const gameId = route.params.gameId;

let formData = ref({});

const filterDropdowns = reactive({
    category: '',
    subcategory: '',
    user: '',
    entryStatus: '',
});

const filters = reactive({
    category: {
        value: computed(() => filterDropdowns.category),
        getFilterValue: (entry: Entry) => entry.category.slug,
    },
    subcategory: {
        value: computed(() => filterDropdowns.subcategory),
        getFilterValue: (entry: Entry) => entry.subcategory.slug,
    },
    userId: {
        value: computed(() => filterDropdowns.user),
        getFilterValue: (entry: Entry) => entry.userId,
    },
    isCurrentRecord: {
        value: computed(() => filterDropdowns.entryStatus === 'current'),
        getFilterValue: (entry: Entry) => entry.isCurrentRecord,
    },
    isRecordImprovement: {
        value: computed(() => filterDropdowns.entryStatus === 'improvements'),
        getFilterValue: (entry: Entry) => entry.isRecordImprovement,
    },
});

const tableOptions: TableOptions = {
    rowsPerPage: ref('10'),
    orderByKeyArray: ['created'],
    orderByOrderArray: ['desc'],
};

const subcategoryFilterSet = computed((): Subcategory[] => {
    const subcategorySet = game.value.getCategory(
        filterDropdowns.category,
    ).subcategories;
    return _.orderBy(subcategorySet, ['displayOrder']);
});

const subcategoryName = computed((): string => {
    if (filterDropdowns.category) {
        return game.value.getSubcategoryDisplayName(filterDropdowns.category);
    }
    return 'Subcategory';
});

const setFormData = (entry: Entry): void => {
    formData.value = entry;
};

const downloadFile = (entry: Entry): void => {
    downloadItem(getFileDownloadLink(entry));
};

const getFileDownloadLink = (entry: Entry): string => {
    return `${process.env.VUE_APP_STORAGE_URL}/${process.env.VUE_APP_DATABASE}%2F${gameId}%2Ffiles%2F${entry.id}%2F${entry.fileName}?alt=media&token=6557a94f-4fcf-428c-894d-525eb940f2fe`;
};

const downloadItem = async (url: string) => {
    console.log(url);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MARIOKART64_Cont_1.mpk');
    document.body.appendChild(link);
    link.click();
};

const table = useTable(rows, tableOptions, filters, filterDropdowns);
const helpers = useHelpers();
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

.filter-icon {
    margin: 3px 0 0 0;
}

.btn-light {
    font-size: 12px;
}
</style>
