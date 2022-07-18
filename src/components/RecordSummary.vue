<template>
    <div v-if="selectedCategory" class="section-container mx-auto">
        <div class="row section-header">
            <div class="col">Record Summary</div>
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="dropdowns.selectedCategorySlug"
                    >
                        <option
                            v-for="category in game.categories"
                            :key="category.slug"
                            :value="category.slug"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col category-header">
                {{ selectedCategory.subcategoryName }}
            </div>
            <div class="col category-header">Time</div>
            <div class="col category-header">Player</div>
        </div>
        <div
            v-for="summary in rows"
            :key="summary.slug"
            class="row subcategory-row"
            :class="summary.endOfGroup ? 'end-row' : ''"
            :v-if="summary"
        >
            <div class="col">{{ summary.name }}</div>
            <div class="col">
                {{ getRecord(summary)?.formattedScore }}
            </div>
            <div class="col">
                {{ game.getUser(getRecord(summary)?.userId || '').displayName }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { Game } from '@/game/Game';
import { Entry } from '@/game/Entry';
import { Subcategory } from '@/game/Subcategory';
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import { reactive } from 'vue';

interface RecordSummaryRow extends Subcategory {
    endOfGroup: boolean;
}

const game = computed<Game>(() => useStore().state.game);

const dropdowns = reactive({
    selectedCategorySlug: '3lap',
});

const selectedCategory = computed(() =>
    game.value.getCategory(dropdowns.selectedCategorySlug),
);

const getRecord = (subcategory: Subcategory): Entry | undefined => {
    const record = game.value.getRecord(
        selectedCategory.value.slug,
        subcategory.slug,
    );
    return record;
};

const buildRecordSummaryRows = (): RecordSummaryRow[] => {
    const result: RecordSummaryRow[] = [];
    const orderedJson = _.orderBy(selectedCategory.value.subcategories, [
        'displayOrder',
    ]);
    for (const jsonRow of orderedJson) {
        result.push(jsonRow as RecordSummaryRow);
    }

    for (let i = 0; i < result.length - 1; i++) {
        if (result[i]['group'] !== result[i + 1]['group']) {
            result[i].endOfGroup = true;
        }
    }
    return result;
};

const rows = computed(() => buildRecordSummaryRows());
</script>

<style scoped>
select {
    float: right;
}
.end-row {
    border-bottom: 1px dashed lightgrey;
}
</style>
