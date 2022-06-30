<template>
    <div class="section-container mx-auto">
        <div
            v-for="(user, index) in users"
            :key="user.id"
            class="row user-badge"
            :v-if="game.users.length > 0"
        >
            <div class="col">
                <div class="row leaderboard-header text-start">
                    <div class="col">
                        #{{ index + 1 }} -
                        {{ user.displayName }}
                    </div>
                </div>
                <div class="row badge-row text-start">
                    <div class="col-7">
                        <span class="highlight"
                            >Current Records:
                            {{ user.currentRecordTotal }} </span
                        ><br />
                        Total Record Improvements:
                        {{ user.recordImprovementTotal }} <br />
                        Total Submissions: {{ user.times.length }}
                    </div>
                    <div v-if="user.favoriteRun" class="col-5">
                        Favorite Run: <br />
                        {{ user.favoriteRun.displayName }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
    computed: {
        ...mapState(['game']),
        users() {
            const first = _.orderBy(
                this.game.users,
                ['currentRecordTotal'],
                ['desc'],
            );
            const second = _.orderBy(
                first,
                ['recordImprovementTotal'],
                ['desc'],
            );
            return second;
        },
    },
};
</script>

<style scoped>
.leaderboard-header {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 5px;
    margin-bottom: 10px;
    border-bottom: 2px solid lightgrey;
}

.user-badge {
    margin: 30px;
}

.badge-row {
    margin: 5px;
}
</style>
