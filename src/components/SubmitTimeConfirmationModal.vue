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
                        <div class="col-8 right-col">{{ formData.type }}</div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Time:</div>
                        <div class="col-8 right-col">
                            {{ formData.time.min }} ' {{ formData.time.sec }} "
                            {{ formData.time.ms }}"
                        </div>
                    </div>
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
                        type="button"
                        class="btn btn-danger"
                        data-bs-dismiss="modal"
                    >
                        Cancel
                    </button>
                    <button type="button" class="btn btn-primary">
                        Submit Time
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        formData: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState(['data']),
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
</style>
