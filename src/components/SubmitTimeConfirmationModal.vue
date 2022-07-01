<template>
    <div
        class="modal fade"
        id="submitTimeConfirmationModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                        Confirm Submission
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-4 left-col">Player:</div>
                        <div class="col-8 right-col">
                            {{ data.getUserDisplayName(formData.userId) }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Category:</div>
                        <div class="col-8 right-col">
                            {{ data.getCategoryName(formData.categorySlug) }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Subcategory:</div>
                        <div class="col-8 right-col">
                            {{
                                data.getSubcategoryName(
                                    formData.categorySlug,
                                    formData.subcategorySlug,
                                )
                            }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Time:</div>
                        <div class="col-8 right-col">
                            {{ formData.time.min || '0' }}'{{
                                Time.zeroPad(formData.time.sec, 2) || '00'
                            }}"{{ formData.time.ms || '00' }}
                        </div>
                    </div>
                    <div class="spacer"></div>
                    <div class="row">
                        <div class="col-4 left-col">Link:</div>
                        <div class="col-8 right-col">{{ formData.link }}</div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Notes:</div>
                        <div class="col-8 right-col">{{ formData.notes }}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        v-if="!uploading && !success"
                        type="button"
                        class="btn btn-danger"
                        data-bs-dismiss="modal"
                    >
                        Cancel
                    </button>

                    <button
                        v-if="!uploading && !success"
                        type="button"
                        class="btn btn-primary"
                        @click="submitForm"
                    >
                        Submit Time
                    </button>

                    <div
                        v-if="success"
                        type="button"
                        class="alert alert-success"
                        role="alert"
                    >
                        Your time has been submitted!
                    </div>
                    <div
                        v-if="uploading"
                        type="button"
                        class="alert alert-warning"
                        role="alert"
                    >
                        Uploading time, please wait...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import axios from 'axios';
import qs from 'qs';
import { Time } from '@/game/Time';
import { config } from '../config';
import { defineComponent } from '@vue/composition-api';
import { ref } from '@vue/reactivity';

export default defineComponent({
    props: {
        formData: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const success = ref(false);
        const uploading = ref(false);
        return {
            success,
            uploading,
            Time,
            config,
        };
    },
    computed: {
        ...mapState(['data']),
    },
    methods: {
        async submitForm() {
            this.uploading.value = true;
            const data = qs.stringify({
                userId: this.formData.userId,
                subcategorySlug: this.formData.subcategorySlug,
                timeMs: this.Time.elapsedTimeToMs(
                    `${this.formData.time.min || 0}'${
                        this.formData.time.sec || 0
                    }"${this.formData.time.ms || 0}'`,
                ),
                link: this.formData.link,
                notes: this.formData.notes,
                categorySlug: this.formData.categorySlug,
            });

            const config = {
                method: 'post',
                url: this.config.ADD_URL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data,
            };
            try {
                await axios(config as Record<string, unknown>);
                console.log('Time submitted successfully!');
                this.uploading.value = false;
                this.success.value = true;
                this.$cookies.set('userId', this.formData.userId);
                this.$cookies.set(
                    'subcategorySlug',
                    this.formData.subcategorySlug,
                );
                this.$cookies.set('categorySlug', this.formData.categorySlug);

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                this.uploading.value = false;
                console.log(error);
            }
        },
    },
});
</script>

<style scoped>
.left-col {
    text-align: right;
    font-weight: bold;
}
.right-col {
    text-align: left;
    word-break: break-all;
}
.spacer {
    margin-top: 10px;
}
</style>
