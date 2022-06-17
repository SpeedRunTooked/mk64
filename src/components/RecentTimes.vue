<template>
    <div class="section-container">
        <div class="row">
            <div class="col section-header">Recent Times</div>
        </div>
        <div class="row" v-for="time in recentTimes" :key="time.created">
            <div class="col">
                {{ time.created.toLocaleDateString() }}
            </div>
            <div class="col">
                {{ data.getTrackName(time.trackSlug) }}
            </div>
            <div class="col">
                {{ data.getRecordType(time.type) }}
            </div>
            <div class="col">
                {{ time.timeElapsed }}
            </div>
            <div class="col">
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
            return this.data.getRecentTimes(10);
        },
    },
};
</script>
