<script setup lang="ts">
import _ from 'lodash';
import { Game } from '@/game/Game';
import { Entry } from '@/game/Entry';
import { Subcategory } from '@/game/Subcategory';
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import { reactive } from 'vue';
import { User } from '@/game/User';
import { useHelpers } from '@/composables/useHelpers';

interface RecordSummaryRow extends Subcategory {
    endOfGroup: boolean;
}

const game = computed<Game>(() => useStore().state.game);

const helpers = useHelpers();

const dropdowns = reactive({
    selectedCategorySlug: game.value.categories[0].slug,
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

const getRecordHolder = (summary: RecordSummaryRow): User | undefined => {
    const record = getRecord(summary);
    if (!record) return undefined;
    return game.value.getUser(record.userId);
};

const buildRecordSummaryRows = (): RecordSummaryRow[] => {
    const result: RecordSummaryRow[] = [];
    let orderedJson: Subcategory[] = [];
    if (selectedCategory.value.displayOrder) {
        orderedJson = _.orderBy(selectedCategory.value.subcategories, [
            'displayOrder',
        ]);
    } else {
        orderedJson = _.orderBy(selectedCategory.value.subcategories, ['name']);
    }

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

<template>
    <div v-if="game.categories.length > 0" class="section-container mx-auto">
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
                            v-for="category in game.getCategories()"
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
            <div class="col category-header">
                {{ helpers.getEntryTypeText(selectedCategory) }}
            </div>
            <div class="col category-header">Player</div>
        </div>
        <div v-if="rows.length > 0">
            <div
                v-for="summary in rows"
                :key="summary.slug"
                class="row subcategory-row"
                :class="summary.endOfGroup ? 'end-row' : ''"
            >
                <div class="col">{{ summary.name }}</div>
                <div class="col">
                    {{ getRecord(summary)?.formattedScore || 'None yet!' }}
                </div>
                <div class="col">
                    {{ getRecordHolder(summary)?.displayName || 'None yet!' }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
select {
    float: right;
}
.end-row {
    border-bottom: 1px dashed lightgrey;
}
</style>
