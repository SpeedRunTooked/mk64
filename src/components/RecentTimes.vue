<template>
    <div class="section-container mx-auto">
        <div class="row">
            <div class="col section-header">Recent Times</div>
            <div class="col align-end">
                <div class="select-wrapper">
                    <select class="form-select" v-model="entries">
                        <option value="5" selected>5</option>
                        <option value="10" selected>10</option>
                        <option value="15" selected>15</option>
                        <option value="20" selected>20</option>
                    </select>
                </div>
            </div>
        </div>
        <div
            class="row time-row"
            v-for="time in recentTimes"
            :key="time.created"
        >
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
    data() {
        return {
            entries: 5,
        };
    },
    computed: {
        ...mapState(['data']),
        recentTimes() {
            return this.data.getRecentTimes(this.entries);
        },
    },
};
</script>

<style scoped>
select {
    /* width: 150px; */
    float: right;
}
.select-wrapper {
    width: 70px;
    float: right;
    height: 50px;
}
</style>
<style scoped>
.time-row {
    padding: 2px;
}
</style>
