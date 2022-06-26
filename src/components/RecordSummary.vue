<template>
    <div v-if="data.categories.length > 0" class="section-container mx-auto">
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
                            v-for="(category, index) in data.categories"
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
        >
            <div class="col">{{ subcategory.name }}</div>
            <div class="col">
                {{ getElapsedTime(subcategory) }}
            </div>
            <div class="col">
                {{ getPlayerDisplayName(subcategory) }}
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
        ...mapState(['data']),
        selectedCategory() {
            return this.data.categories[this.selectedCategoryIndex];
        },
        rows() {
            return _.orderBy(this.selectedCategory.subcategories, ['name']);
        },
    },
    methods: {
        getElapsedTime(subcategory) {
            const time = this.data.getRecord(
                subcategory.slug,
                this.selectedCategory.slug,
            )?.timeElapsed;
            return time || 'None yet!';
        },
        getPlayerDisplayName(subcategory) {
            const name = this.data.getRecord(
                subcategory.slug,
                this.selectedCategory.slug,
            )?.userDisplayName;
            return name || 'None yet!';
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
</style>
