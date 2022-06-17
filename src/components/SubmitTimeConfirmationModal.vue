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
                        <div class="col-4 left-col">Track:</div>
                        <div class="col-8 right-col">
                            {{ data.getTrackName(formData.trackSlug) }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Record Type:</div>
                        <div class="col-8 right-col">
                            {{ data.getRecordType(formData.type) }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Time:</div>
                        <div class="col-8 right-col">
                            {{ formData.time.min || '0' }}'{{
                                formData.time.sec || '0'
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
                        v-if="!success"
                        type="button"
                        class="btn btn-danger"
                        data-bs-dismiss="modal"
                    >
                        Cancel
                    </button>

                    <button
                        v-if="!success"
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import qs from 'qs';
import { TimeUtils } from '@/utils/TimeUtils';

export default {
    data() {
        return {
            success: false,
        };
    },
    props: {
        formData: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState(['data']),
    },
    methods: {
        async submitForm() {
            const data = qs.stringify({
                userId: this.formData.userId,
                trackSlug: this.formData.trackSlug,
                timeMs: TimeUtils.elapsedTimeToMs(
                    `${this.formData.time.min || 0}'${
                        this.formData.time.sec || 0
                    }"${this.formData.time.ms || 0}'`,
                ),
                link: this.formData.link,
                notes: this.formData.notes,
                type: this.formData.type,
            });

            const config = {
                method: 'post',
                url: 'http://localhost:5001/mk64-ad77f/us-central1/addTime',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data,
            };
            await axios(config);
            console.log('Time submitted successfully!');
            this.success = true;

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },
    },
};
</script>

<style scoped>
.left-col {
    text-align: right;
}
.right-col {
    text-align: left;
}
.spacer {
    margin-top: 10px;
}
</style>
