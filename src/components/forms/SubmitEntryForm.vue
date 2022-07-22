<script setup lang="ts">
import _ from 'lodash';
import { useStore } from 'vuex';
import { Game } from '@/game/Game';
import { Entry } from '@/game/Entry';
import { Category } from '@/game/Category';
import { Subcategory } from '@/game/Subcategory';
import { reactive, computed } from '@vue/reactivity';
import { useHelpers } from '@/composables/useHelpers';
import { useCookies } from '@vueuse/integrations/useCookies';
import SubmitEntryConfirmationModal from '../modals/SubmitEntryConfirmationModal.vue';

const game = computed<Game>(() => useStore().state.game);

const cookies = useCookies();
const helpers = useHelpers();

const formData = reactive({
    userId: cookies.get('userId') || '',
    categorySlug: cookies.get('categorySlug') || '',
    subcategorySlug: cookies.get('subcategorySlug') || '',
    time: {
        min: '',
        sec: '',
        ms: '',
    },
    link: '',
    notes: '',
    score: '',
});

const selectedCategory = computed((): Category => {
    return game.value.getCategory(formData.categorySlug);
});

const entryType = computed(() => selectedCategory.value.entryType);

const categoryAndSubcategorySelected = computed((): boolean => {
    return formData.subcategorySlug !== '' && formData.categorySlug !== '';
});

const categoryAndSubcategoryAndUserSelected = computed((): boolean => {
    return (
        categoryAndSubcategorySelected.value === true && formData.userId !== ''
    );
});

const scoreValid = computed((): boolean => {
    if (entryType.value === 'timeMs') {
        return (
            formData.time.sec !== '' && String(formData.time.ms).length === 2
        );
    }

    if (entryType.value === 'score') {
        return formData.score !== '';
    }
    return false;
});

const ready = computed((): boolean => {
    return (
        categoryAndSubcategoryAndUserSelected.value === true &&
        scoreValid.value === true
    );
});

const showSubcategories = computed((): boolean => {
    return formData.categorySlug && game.value.categories.length > 0
        ? true
        : false;
});

const subcategoryList = computed((): Subcategory[] => {
    const list: Subcategory[] = selectedCategory?.value.subcategories || [];
    return _.orderBy(list, ['displayOrder']);
});

const msError = computed((): boolean => {
    return formData.time.ms !== '' && String(formData.time.ms).length !== 2;
});

const currentRecord = computed((): Entry | undefined => {
    if (categoryAndSubcategorySelected) {
        return game.value.getRecord(
            formData.categorySlug,
            formData.subcategorySlug,
        );
    }
    return undefined;
});

const subcategoryName = computed((): string => {
    return selectedCategory?.value.subcategoryName || 'Subcategory';
});

const userRecord = computed((): string => {
    if (categoryAndSubcategoryAndUserSelected) {
        const user = game.value.getUser(formData.userId);
        if (user) {
            const record = user.getRecord(
                selectedCategory.value,
                formData.subcategorySlug,
            );
            return record?.formattedScore || 'None yet!';
        }
    }
    return 'None yet!';
});

const showRecordTimes = computed((): boolean => {
    return categoryAndSubcategorySelected.value && showSubcategories.value;
});

const resetSubcategory = (): void => {
    if (
        formData.subcategorySlug &&
        formData.subcategorySlug !== '' &&
        !selectedCategory.value.getSubcategory(formData.subcategorySlug)
    ) {
        formData.subcategorySlug = '';
    }
};
</script>

<template>
    <div>
        <SubmitEntryConfirmationModal
            :form-data="formData"
            :entry-type="entryType"
        ></SubmitEntryConfirmationModal>
        <form>
            <div class="mb-4">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="formData.userId"
                >
                    <option value="" disabled selected>Select Player</option>

                    <option
                        v-for="user in game.users"
                        :key="user.id"
                        :value="user.id"
                    >
                        {{ game.getUser(user.id)?.displayName }}
                    </option>
                    <!-- </li> -->
                </select>
            </div>

            <div class="mb-4">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="formData.categorySlug"
                    @change="resetSubcategory()"
                >
                    <option value="" disabled selected>Category</option>

                    <option
                        v-for="(category, key) in game.categories"
                        :value="category.slug"
                        :key="key"
                    >
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <div class="mb-4" v-if="showSubcategories">
                <select
                    class="form-select"
                    aria-label="Default select example"
                    v-model="formData.subcategorySlug"
                >
                    <option value="" disabled selected>
                        Select {{ subcategoryName }}
                    </option>

                    <option
                        v-for="subcategory in subcategoryList"
                        :key="subcategory.slug"
                        :value="subcategory.slug"
                    >
                        {{ subcategory.name }}
                    </option>
                </select>
            </div>

            <div v-if="showRecordTimes" class="mb-4">
                <div class="row reference-row">
                    <div class="col">
                        Current Record:<br />
                        {{ currentRecord?.formattedScore || 'None yet!' }}
                        <br />
                        <span class="small">{{
                            currentRecord
                                ? game.getUser(currentRecord.userId).displayName
                                : ''
                        }}</span>
                    </div>
                    <div
                        v-if="categoryAndSubcategoryAndUserSelected"
                        class="col"
                    >
                        Your Best
                        {{ helpers.getEntryTypeText(selectedCategory) }}:
                        {{ userRecord }}
                    </div>
                </div>
            </div>
            <div class="mb-5">
                <div v-show="entryType === 'score'" class="row">
                    <div class="col">
                        <label for="score" class="form-label">Score</label>
                        <input
                            type="number"
                            class="form-control"
                            id="score"
                            v-model="formData.score"
                            placeholder="0"
                        />
                    </div>
                </div>
                <div v-show="entryType === 'timeMs'" class="row">
                    <div class="col">
                        <label for="link" class="form-label">Minutes</label>
                        <input
                            type="number"
                            class="form-control"
                            id="mins"
                            v-model="formData.time.min"
                            placeholder="0"
                        />
                    </div>
                    <div class="col">
                        <label for="secs" class="form-label">Seconds</label>
                        <input
                            type="number"
                            class="form-control"
                            id="secs"
                            v-model="formData.time.sec"
                            placeholder="0"
                        />
                    </div>
                    <div class="col">
                        <label for="ms" class="form-label">Centiseconds</label>
                        <input
                            type="number"
                            class="form-control"
                            id="ms"
                            v-model="formData.time.ms"
                            placeholder="00"
                        />
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="link" class="form-label">Photo or Video Link</label>
                <input
                    type="text"
                    class="form-control"
                    id="link"
                    v-model="formData.link"
                    placeholder="Post a link to a screenshot or video"
                />
            </div>
            <div class="mb-5">
                <label for="notes" class="form-label">Notes</label>
                <input
                    type="text"
                    class="form-control"
                    id="notes"
                    v-model="formData.notes"
                    placeholder="(Optional)"
                />
            </div>
            <div class="d-grid gap-1">
                <button
                    :disabled="!ready"
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#submitEntryConfirmationModal"
                >
                    Submit Time
                </button>
                <div v-if="msError" class="alert alert-danger" role="alert">
                    Centiseconds must be two digits!
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.header {
    margin-bottom: 20px;
}
.alert-danger {
    margin-top: 15px;
}
.small {
    font-size: 12px;
}
.reference-row {
    background-color: rgb(243, 243, 243);
    padding: 10px 5px;
    margin-left: 5px;
    margin-right: 5px;
    -moz-box-shadow: inset 0 0 3px #bbbbbb;
    -webkit-box-shadow: inset 0 0 3px #bbbbbb;
    box-shadow: inset 0px 0px 3px #bbbbbb;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
}
</style>
