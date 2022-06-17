<template>
    <div class="section-container mx-auto">
        <div class="row">
            <div class="col section-header">Recent Times</div>
        </div>
        <div class="row" v-for="time in recentTimes" :key="time.created">
            <div class="col-2">
                {{ time.created.toLocaleDateString() }}
            </div>
            <div class="col-4">
                {{ data.getTrackName(time.trackSlug) }}
            </div>
            <div class="col-2">
                {{ data.getRecordType(time.recordType) }}
            </div>
            <div class="col-2">
                {{ time.timeElapsed }}
            </div>
            <div class="col-2">
                {{ time.userDisplayName }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['data']),
        recentTimes() {
            return this.data.getRecentTimes(6);
        },
    },
};
</script>
