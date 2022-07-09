<template>
    <div class="section-container mx-auto">
        <SubmitEntryConfirmationModal
            :formData="formData"
        ></SubmitEntryConfirmationModal>
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
                                Record Time:<br />
                                {{
                                    currentRecord?.formattedScore || 'None yet!'
                                }}
                                <br />
                                <span class="small">{{
                                    game.getUser(currentRecord.userId)
                                        .displayName
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
                            data-bs-target="#submitEntryConfirmationModal"
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
import _ from 'lodash';
import { Entry } from '@/game/Entry';
import { Game } from '@/game/Game';
import { Subcategory } from '@/game/Subcategory';
import { defineComponent } from '@vue/composition-api';
import SubmitEntryConfirmationModal from '@/components/SubmitEntryConfirmationModal.vue';
import { Category } from '@/game/Category';

export default defineComponent({
    name: 'SubmitEntryView',
    components: {
        SubmitEntryConfirmationModal,
    },

    data() {
        return {
            formData: {
                userId: this.$cookies.get('userId') || '',
                categorySlug: this.$cookies.get('categorySlug') || '',
                subcategorySlug: this.$cookies.get('subcategorySlug') || '',
                time: {
                    min: '',
                    sec: '',
                    ms: '',
                },
                link: '',
                notes: '',
            },
        };
    },

    computed: {
        game(): Game {
            return this.$store.state.game;
        },

        ready(): boolean {
            return (
                this.categoryAndSubcategoryAndUserSelected &&
                this.formData.time.sec !== '' &&
                String(this.formData.time.ms).length === 2 &&
                this.formData.link !== ''
            );
        },

        showSubcategories(): boolean {
            return this.formData.categorySlug && this.game.categories.length > 0
                ? true
                : false;
        },

        subcategoryList(): Subcategory[] {
            const list: Subcategory[] =
                this.selectedCategory?.subcategories || [];
            return _.orderBy(list, ['name']);
        },

        msError(): boolean {
            return (
                this.formData.time.ms !== '' &&
                String(this.formData.time.ms).length !== 2
            );
        },

        currentRecord(): Entry | undefined {
            if (this.categoryAndSubcategorySelected) {
                return this.game.getRecord(
                    this.formData.categorySlug,
                    this.formData.subcategorySlug,
                );
            }
            return undefined;
        },

        selectedCategory(): Category {
            return this.game.getCategory(this.formData.categorySlug);
        },

        subcategoryName(): string {
            return this.selectedCategory?.subcategoryName || 'Subcategory';
        },

        userRecord(): string {
            if (this.categoryAndSubcategoryAndUserSelected) {
                const user = this.game.getUser(this.formData.userId);
                if (user) {
                    const record = user.getRecord(
                        this.formData.categorySlug,
                        this.formData.subcategorySlug,
                    );
                    return record?.formattedScore || 'None yet!';
                }
            }
            return 'None yet!';
        },

        categoryAndSubcategorySelected(): boolean {
            return this.formData.subcategorySlug && this.formData.categorySlug;
        },

        categoryAndSubcategoryAndUserSelected(): boolean {
            return this.categoryAndSubcategorySelected && this.formData.userId;
        },

        showRecordTimes(): boolean {
            return (
                this.categoryAndSubcategorySelected && this.showSubcategories
            );
        },
    },

    methods: {
        resetSubcategory(): void {
            if (
                this.formData.subcategorySlug &&
                this.formData.subcategorySlug !== '' &&
                !this.selectedCategory.getSubcategory(
                    this.formData.subcategorySlug,
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
