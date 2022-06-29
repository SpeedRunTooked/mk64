<template>
    <div v-if="game.categories.length > 0" class="section-container mx-auto">
        <div class="row section-header">
            <div class="col">Record Summary</div>
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="selectedCategoryIndex"
                    >
                        <option
                            v-for="(category, index) in game.categories"
                            :key="category.slug"
                            :value="index"
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
            v-for="subcategory in rows"
            :key="subcategory.slug"
            class="row subcategory-row"
            :class="subcategory?.endOfGroup ? 'end-row' : ''"
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

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
    data() {
        return {
            selectedCategoryIndex: 0,
        };
    },

    computed: {
        ...mapState(['game']),
        selectedCategory() {
            return this.game.categories[this.selectedCategoryIndex];
        },
        rows() {
            const rows = _.orderBy(this.selectedCategory.subcategories, [
                'displayOrder',
            ]);

            for (let i = 0; i < rows.length - 1; i++) {
                if (rows[i]['group'] !== rows[i + 1]['group']) {
                    rows[i].endOfGroup = true;
                }
            }
            return rows;
        },
    },
    methods: {
        getElapsedTime(subcategory) {
            const time = this.game.getRecord(
                subcategory.slug,
                this.selectedCategory.slug,
            )?.timeElapsed;
            return time || 'None yet!';
        },
        getUserDisplayName(subcategory) {
            const record = this.game.getRecord(
                subcategory.slug,
                this.selectedCategory.slug,
            );
            return record?.user?.displayName || 'None yet!';
        },
    },
};
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
