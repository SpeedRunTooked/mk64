<template>
    <div
        class="modal fade"
        id="submit-data-modal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                        Submit a File for This Run
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body" v-if="data">
                    <div class="row mb-2">
                        <div class="col-4 left-col">Player:</div>
                        <div class="col-8 right-col">
                            {{ game.getUser(data.userId)?.displayName || '' }}
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-4 left-col">Category:</div>
                        <div class="col-8 right-col">
                            {{ data.category?.name || '' }}
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-4 left-col">Subcategory:</div>
                        <div class="col-8 right-col">
                            {{ data.subcategory?.name || '' }}
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col-4 left-col">Time:</div>
                        <div class="col-8 right-col">
                            {{ data.formattedScore || '' }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-2"></div>
                        <div class="col-8">
                            <input
                                class="form-control"
                                type="file"
                                ref="file"
                                id="formFile"
                                @change="onFileChange"
                            />
                        </div>
                        <div class="col-2"></div>
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
                        Submit File
                    </button>

                    <div
                        v-if="success"
                        type="button"
                        class="alert alert-success"
                        role="alert"
                    >
                        Your file has been submitted! <br />It may take a minute
                        for it to appear on the site.
                    </div>
                    <div
                        v-if="uploading"
                        type="button"
                        class="alert alert-warning"
                        role="alert"
                    >
                        Uploading file, please wait...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { Time } from '@/game/Time';
import { Game } from '@/game/Game';
import { defineComponent } from '@vue/composition-api';
import { Entry } from '@/game/Entry';

export default defineComponent({
    props: {
        formData: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            success: false,
            uploading: false,
            Time,
            file: '',
        };
    },

    computed: {
        game(): Game {
            return this.$store.state.game;
        },
        data(): Entry {
            return this.formData as Entry;
        },
    },

    methods: {
        onFileChange() {
            this.file = this.$refs.file.files[0];
        },
        async submitForm() {
            this.uploading = true;
            const formData = new FormData();

            formData.append('file', this.file);
            formData.append('entryId', this.data.id);
            formData.append('gameId', 'mk64');

            const config = {
                method: 'post',
                url: process.env.VUE_APP_UPLOAD_URL,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            };

            try {
                await axios(config as Record<string, unknown>);
                console.log('File submitted successfully!');
                this.uploading = false;
                this.success = true;

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } catch (error) {
                this.uploading = false;
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
