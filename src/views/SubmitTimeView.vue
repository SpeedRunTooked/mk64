<template>
    <div class="section-container mx-auto">
        <SubmitTimeConfirmationModal
            :formData="formData"
        ></SubmitTimeConfirmationModal>
        <div class="row">
            <div class="col">
                <form>
                    <div class="mb-4">
                        <select
                            class="form-select"
                            aria-label="Default select example"
                            v-model="formData.userId"
                        >
                            <option value="" disabled selected>
                                Select Player
                            </option>

                            <option
                                v-for="(value, key) in data.users"
                                :key="key"
                                :value="key"
                            >
                                {{ value.displayName }}
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
                                v-for="(category, key) in data.categories"
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
                                Select Subcategory
                            </option>

                            <option
                                v-for="subcategory in data.getSubcategories(
                                    formData.categorySlug,
                                )"
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
                                Record Time:<br />
                                {{ currentRecord?.timeElapsed }} <br />
                                <span class="small">{{
                                    currentRecord?.userDisplayName
                                }}</span>
                            </div>
                            <div
                                v-if="categoryAndSubcategoryAndPlayerSelected"
                                class="col"
                            >
                                Your Best Time: {{ playerRecord }}
                            </div>
                        </div>
                    </div>
                    <div class="mb-5">
                        <div class="row">
                            <div class="col">
                                <label for="link" class="form-label"
                                    >Minutes</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="mins"
                                    v-model="formData.time.min"
                                    placeholder="0"
                                />
                            </div>
                            <div class="col">
                                <label for="secs" class="form-label"
                                    >Seconds</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="secs"
                                    v-model="formData.time.sec"
                                    placeholder="0"
                                />
                            </div>
                            <div class="col">
                                <label for="ms" class="form-label"
                                    >Centiseconds</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="ms"
                                    v-model="formData.time.ms"
                                    placeholder="00"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="link" class="form-label"
                            >Photo or Video Link</label
                        >
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
                            data-bs-target="#submitTimeConfirmationModal"
                        >
                            Submit Time
                        </button>
                        <div
                            v-if="msError"
                            class="alert alert-danger"
                            role="alert"
                        >
                            Centiseconds must be two digits!
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import SubmitTimeConfirmationModal from '@/components/SubmitTimeConfirmationModal.vue';
import { Time } from '@/game/Time';

export default defineComponent({
    name: 'SubmitTimeView',
    data() {
        return {
            formData: {
                userId: this.$cookies.get('userId') || '',
                subcategorySlug: this.$cookies.get('subcategorySlug') || '',
                time: {
                    min: '',
                    sec: '',
                    ms: '',
                },
                link: '',
                notes: '',
                categorySlug: this.$cookies.get('categorySlug') || '',
            },
            showSubcategories: false,
        };
    },
    components: {
        SubmitTimeConfirmationModal,
    },
    computed: {
        ...mapState(['data']),
        ready(): boolean {
            return (
                this.categoryAndSubcategoryAndPlayerSelected &&
                this.formData.time.sec !== '' &&
                String(this.formData.time.ms).length === 2 &&
                this.formData.link !== ''
            );
        },
        msError(): boolean {
            return (
                this.formData.time.ms !== '' &&
                String(this.formData.time.ms).length !== 2
            );
        },
        currentRecord(): Time | null {
            if (this.categoryAndSubcategorySelected) {
                return this.data.getRecord(
                    this.formData.subcategorySlug,
                    this.formData.categorySlug,
                );
            }
            return null;
        },
        playerRecord(): string {
            if (this.categoryAndSubcategoryAndPlayerSelected) {
                const stats = this.data.getPlayerStats(this.formData.userId);
                if (stats) {
                    return (
                        stats.getRecord(
                            this.formData.subcategorySlug,
                            this.formData.categorySlug,
                        )?.timeElapsed || 'None yet!'
                    );
                }
            }
            return 'None yet!';
        },
        categoryAndSubcategorySelected(): boolean {
            return this.formData.subcategorySlug && this.formData.categorySlug;
        },
        categoryAndSubcategoryAndPlayerSelected(): boolean {
            return this.categoryAndSubcategorySelected && this.formData.userId;
        },
        showRecordTimes() {
            return (
                this.categoryAndSubcategorySelected && this.showSubcategories
            );
        },
    },
    methods: {
        resetSubcategory() {
            this.showSubcategories = true;
            if (
                this.formData.subcategorySlug !== '' &&
                !this.data.subcategoryExistsInCategory(
                    this.formData.subcategorySlug,
                    this.formData.categorySlug,
                )
            ) {
                this.formData.subcategorySlug = '';
            }
        },
    },
});
</script>

<style scoped>
.section-container {
    width: 300px;
}
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
