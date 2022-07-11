<template>
    <div v-if="selectedCategory" class="section-container mx-auto">
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

<script lang="ts">
import _ from 'lodash';
import { Game } from '@/game/Game';
import { Entry } from '@/game/Entry';
import { Category } from '@/game/Category';
import { Subcategory } from '@/game/Subcategory';
import { defineComponent } from 'vue';

interface RecordSummaryRow extends Subcategory {
    endOfGroup: boolean;
}

export default defineComponent({
    data() {
        return {
            selectedCategorySlug: '3lap',
        };
    },

    computed: {
        game(): Game {
            return this.$store.state.game;
        },

        rows(): RecordSummaryRow[] {
            const result: RecordSummaryRow[] = [];
            const orderedJson = _.orderBy(this.selectedCategory.subcategories, [
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
        },

        selectedCategory(): Category {
            return this.game.getCategory(this.selectedCategorySlug);
        },
    },

    methods: {
        getRecord(subcategory: Subcategory): Entry | undefined {
            const record = this.game.getRecord(
                this.selectedCategory.slug,
                subcategory.slug,
            );
            return record;
        },
    },
});
</script>

<style scoped>
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
