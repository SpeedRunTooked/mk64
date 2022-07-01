<template>
    <div class="section-container mx-auto">
        <div class="row section-header">
            <div class="col">Record Summary</div>
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="selectedCategorySlug"
                    >
                        <option
                            v-for="category in getAllCategories()"
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
                {{ getSelectedCategory().subcategoryName }}
            </div>
            <div class="col category-header">Time</div>
            <div class="col category-header">Player</div>
        </div>
        <div
            v-for="subcategory in rows()"
            :key="subcategory.slug"
            class="row subcategory-row"
            :class="subcategory.endOfGroup ? 'end-row' : ''"
            :v-if="subcategory"
        >
            <div class="col">{{ subcategory.name }}</div>
            <div class="col">
                {{ getElapsedTime(subcategory) }}
            </div>
            <div class="col">
                {{ getUserDisplayName(subcategory) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { useStore } from 'vuex';
import { ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { Subcategory } from '@/game/Subcategory';
import { defineComponent } from '@vue/composition-api';

interface RecordSummaryRow extends Subcategory {
    endOfGroup: boolean;
}

export default defineComponent({
    setup() {
        const selectedCategorySlug = ref('3lap');
        const store = useStore();
        const game = computed(() => store.state.game);

        const getSelectedCategory = () =>
            game.value.getCategory(selectedCategorySlug.value).json;

        const getAllCategories = () => game.value.categories;

        const rows = () => {
            const result: RecordSummaryRow[] = [];
            const orderedJson = _.orderBy(getSelectedCategory().subcategories, [
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

        const getElapsedTime = (subcategory: Subcategory) => {
            const time = store.state.game.getRecord(
                subcategory.slug,
                getSelectedCategory().slug,
            )?.timeElapsed;
            return time || 'None yet!';
        };

        const getUserDisplayName = (subcategory: Subcategory) => {
            const record = store.state.game.getRecord(
                subcategory.slug,
                getSelectedCategory().slug,
            );
            return record?.user?.displayName || 'None yet!';
        };

        return {
            selectedCategorySlug,
            getSelectedCategory,
            getAllCategories,
            rows,
            game,
            getElapsedTime,
            getUserDisplayName,
        };
    },
});
</script>

<style scoped>
.cup-row {
    margin-top: 30px;
}

.displayName {
    font-size: 14px;
}

select {
    float: right;
}
.end-row {
    border-bottom: 1px dashed lightgrey;
}
</style>
