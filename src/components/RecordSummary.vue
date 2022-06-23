<template>
    <div class="section-container mx-auto">
        <div class="row section-header">
            <div class="col">Record Summary</div>
            <div class="col">
                <div class="select-wrapper status">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="categorySlug"
                    >
                        <option
                            v-for="category in data.categories"
                            :key="category.slug"
                            :value="category.slug"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div v-if="selectedCategory"></div>
        <div class="row">
            <div class="col category-header">
                {{ selectedCategory.subcategoryName }}
            </div>
            <div class="col category-header">Time</div>
            <div class="col category-header">Player</div>
        </div>
        <div
            v-for="subcategory in selectedCategory.subcategories"
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

export default {
    data() {
        return {
            categorySlug: '',
        };
    },
    watch: {
        data(newValue) {
            this.categorySlug = newValue.categories[0].slug;
        },
    },
    computed: {
        ...mapState(['data']),
        selectedCategory() {
            return (
                this.data.categories.find(
                    (x) => x.slug === this.categorySlug,
                ) || ''
            );
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
.subcategory-row {
    margin-top: 20px;
}

.cup-row {
    margin-top: 30px;
}
.category-header {
    font-weight: bold;
    padding: 0px 0 10px 0;
    border-bottom: 1px solid lightgrey;
}

.displayName {
    font-size: 14px;
}

select {
    float: right;
}
</style>
