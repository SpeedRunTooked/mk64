<template>
    <div class="container">
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
                            v-model="formData.trackSlug"
                        >
                            <option value="" disabled selected>
                                Select Track
                            </option>

                            <optgroup
                                v-for="(cup, key) in data.cups"
                                :label="cup.name"
                                :key="key"
                            >
                                <option
                                    v-for="(track, key) in cup.tracks"
                                    :key="key"
                                    :value="track.slug"
                                >
                                    {{ track.name }}
                                </option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="mb-4">
                        <select
                            class="form-select"
                            aria-label="Default select example"
                            v-model="formData.type"
                        >
                            <option value="" disabled selected>
                                Record Type
                            </option>

                            <option
                                v-for="(type, key) in data.recordtypes"
                                :value="type.slug"
                                :key="key"
                            >
                                {{ type.name }}
                            </option>
                        </select>
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
                                    >Milliseconds</label
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
                            >Photo / Video Link</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="link"
                            v-model="formData.link"
                            placeholder="http://..."
                        />
                    </div>
                    <div class="mb-5">
                        <label for="notes" class="form-label">Notes</label>
                        <input
                            type="text"
                            class="form-control"
                            id="notes"
                            v-model="formData.notes"
                        />
                    </div>
                    <div class="d-grid gap-1">
                        <button
                            type="button"
                            class="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#submitTimeConfirmationModal"
                        >
                            Submit Time
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import SubmitTimeConfirmationModal from '@/components/SubmitTimeConfirmationModal.vue';

export default defineComponent({
    name: 'SubmitTimeView',

    components: {
        SubmitTimeConfirmationModal,
    },
    // setup() {},
    computed: {
        ...mapState(['data']),
    },
    data() {
        return {
            formData: {
                userId: '',
                trackSlug: '',
                time: {
                    min: '',
                    sec: '',
                    ms: '',
                },
                link: '',
                notes: '',
                type: '',
            },
        };
    },
});
</script>

<style scoped>
.container {
    width: 500px;
}
.header {
    margin-bottom: 20px;
}
</style>
