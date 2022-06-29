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
                            v-model="formData.user"
                        >
                            <option value="null" disabled selected>
                                Select Player
                            </option>

                            <option
                                v-for="user in game.users"
                                :key="user.id"
                                :value="user"
                            >
                                {{ user.displayName }}
                            </option>
                            <!-- </li> -->
                        </select>
                    </div>

                    <div class="mb-4">
                        <select
                            class="form-select"
                            aria-label="Default select example"
                            v-model="formData.category"
                            @change="resetSubcategory()"
                        >
                            <option value="null" disabled selected>
                                Category
                            </option>

                            <option
                                v-for="(category, key) in game.categories"
                                :value="category"
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
                            v-model="formData.subcategory"
                        >
                            <option value="null" disabled selected>
                                Select {{ subcategoryName }}
                            </option>

                            <option
                                v-for="subcategory in subcategoryList"
                                :key="subcategory.slug"
                                :value="subcategory"
                            >
                                {{ subcategory.name }}
                            </option>
                        </select>
                    </div>

                    <div v-if="showRecordTimes" class="mb-4">
                        <div class="row reference-row">
                            <div class="col">
                                Record Time:<br />
                                {{ currentRecord?.timeElapsed || 'None yet!' }}
                                <br />
                                <span class="small">{{
                                    currentRecord?.userDisplayName
                                }}</span>
                            </div>
                            <div
                                v-if="categoryAndSubcategoryAndUserSelected"
                                class="col"
                            >
                                Your Best Time: {{ userRecord }}
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
import _ from 'lodash';

export default defineComponent({
    name: 'SubmitTimeView',
    data() {
        return {
            formData: {
                user: this.$cookies.get('user') || null,
                category: this.$cookies.get('category') || null,
                subcategory: this.$cookies.get('subcategory') || null,
                time: {
                    min: null,
                    sec: null,
                    ms: null,
                },
                link: null,
                notes: '',
            },
        };
    },
    components: {
        SubmitTimeConfirmationModal,
    },
    computed: {
        ...mapState(['game']),
        ready(): boolean {
            return (
                this.categoryAndSubcategoryAndUserSelected &&
                this.formData.time.sec !== '' &&
                String(this.formData.time.ms).length === 2 &&
                this.formData.link !== ''
            );
        },
        showSubcategories() {
            return this.formData.category && this.game.categories.length > 0
                ? true
                : false;
        },
        subcategoryList() {
            const list = this.formData.category.subcategories;
            return _.orderBy(list, ['name']);
        },
        msError(): boolean {
            return (
                this.formData.time.ms !== '' &&
                String(this.formData.time.ms).length !== 2
            );
        },
        currentRecord(): Time | null {
            if (this.categoryAndSubcategorySelected) {
                return this.game.getRecord(
                    this.formData.subcategory.slug,
                    this.formData.category.slug,
                );
            }
            return null;
        },
        subcategoryName() {
            if (this.formData.category) {
                return this.formData.category.subcategoryName;
            }
            return 'Subcategory';
        },
        userRecord(): string {
            if (this.categoryAndSubcategoryAndUserSelected) {
                const user = this.game.getUser(this.formData.user);
                if (user) {
                    return (
                        user.getRecord(
                            this.formData.subcategory.slug,
                            this.formData.category.slug,
                        )?.timeElapsed || 'None yet!'
                    );
                }
            }
            return 'None yet!';
        },
        categoryAndSubcategorySelected(): boolean {
            return this.formData.subcategory && this.formData.category;
        },
        categoryAndSubcategoryAndUserSelected(): boolean {
            return this.categoryAndSubcategorySelected && this.formData.user;
        },
        showRecordTimes() {
            return (
                this.categoryAndSubcategorySelected && this.showSubcategories
            );
        },
    },
    methods: {
        resetSubcategory() {
            if (
                this.formData.subcategory.slug !== null &&
                !this.formData.category.subcategoryExists(
                    this.formData.subcategory,
                )
            ) {
                this.formData.subcategory = null;
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
