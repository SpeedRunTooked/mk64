<template>
    <div
        class="modal fade"
        id="submitEntryConfirmationModal"
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
                            {{ game.getUser(formData.userId)?.displayName }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Category:</div>
                        <div class="col-8 right-col">
                            {{ game.getCategory(formData.categorySlug)?.name }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Subcategory:</div>
                        <div class="col-8 right-col">
                            {{
                                game.getSubcategory(formData.subcategorySlug)
                                    ?.name
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
                        <div class="col-8 right-col">
                            {{ formData.link }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4 left-col">Notes:</div>
                        <div class="col-8 right-col">
                            {{ formData.notes }}
                        </div>
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
                        Your time has been submitted! Reloading page...
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

<script setup lang="ts">
import qs from 'qs';
import axios from 'axios';
import { useStore } from 'vuex';
import { defineProps } from 'vue';
import { Time } from '@/game/Time';
import { Game } from '@/game/Game';
import { toRefs, ref, computed } from '@vue/reactivity';
import { useCookies } from '@vueuse/integrations/useCookies';

const props = defineProps({
    formData: {
        required: true,
        type: Object,
    },
});

const { formData } = toRefs(props);

const success = ref(false);
const uploading = ref(false);

const gameId = computed<string>(() => useStore().state.gameId);
const game = computed<Game>(() => useStore().state.game);

const cookies = useCookies();

const submitForm = async () => {
    uploading.value = true;
    const data = qs.stringify({
        gameId: gameId.value,
        userId: formData.value.userId,
        subcategorySlug: formData.value.subcategorySlug,
        score: Time.elapsedTimeToMs(
            `${formData.value.time.min || 0}'${formData.value.time.sec || 0}"${
                formData.value.time.ms || 0
            }'`,
        ),
        link: formData.value.link,
        note: formData.value.notes,
        categorySlug: formData.value.categorySlug,
    });

    const config = {
        method: 'post',
        url: process.env.VUE_APP_ROOT_URL + '/addEntry',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
    };

    try {
        await axios(config as Record<string, unknown>);
        console.log('Time submitted successfully!');
        uploading.value = false;
        success.value = true;
        cookies.set('userId', formData.value.userId);
        cookies.set('subcategorySlug', formData.value.subcategorySlug);
        cookies.set('categorySlug', formData.value.categorySlug);

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
