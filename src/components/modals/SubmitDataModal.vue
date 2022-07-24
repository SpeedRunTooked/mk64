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
                        Submit a Ghost for This Run
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body" v-if="formData">
                    <div class="row mb-2">
                        <div class="col-4 left-col">Player:</div>
                        <div class="col-8 right-col">
                            {{
                                game.getUser(formData.userId)?.displayName || ''
                            }}
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-4 left-col">Category:</div>
                        <div class="col-8 right-col">
                            {{ formData.category?.name || '' }}
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-4 left-col">Subcategory:</div>
                        <div class="col-8 right-col">
                            {{ formData.subcategory?.name || '' }}
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col-4 left-col">Time:</div>
                        <div class="col-8 right-col">
                            {{ formData.formattedScore || '' }}
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
                        :disabled="!file"
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
                        Your file has been submitted! Reloading page...
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

<script setup lang="ts">
import axios from 'axios';
import { useStore } from 'vuex';
import { ref, toRefs } from 'vue';
import { defineProps } from 'vue';
import { Game } from '@/game/Game';
import { computed } from '@vue/reactivity';

const props = defineProps({
    formData: {
        required: true,
        type: Object,
    },
});

const { formData } = toRefs(props);

const success = ref(false);
const uploading = ref(false);
const file = ref(null);

const store = useStore();

const gameId = computed<string>(() => store.state.gameId);
const game = computed<Game>(() => store.state.game);

const submitForm = async () => {
    uploading.value = true;
    const formDataSubmit = new FormData();

    // eslint-disable-next-line
    formDataSubmit.append('file', (file?.value as any).files[0]);
    formDataSubmit.append('entryId', formData.value.id);
    formDataSubmit.append('gameId', gameId.value);

    const config = {
        method: 'post',
        url: process.env.VUE_APP_ROOT_URL + '/addFile',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formDataSubmit,
    };

    try {
        await axios(config as Record<string, unknown>);
        console.log('File submitted successfully!');
        uploading.value = false;
        success.value = true;

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } catch (error) {
        uploading.value = false;
        console.log(error);
    }
};
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
