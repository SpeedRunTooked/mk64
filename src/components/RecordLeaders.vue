<template>
    <div class="section-container mx-auto">
        <div
            v-for="(player, index) in players"
            :key="player.playerId"
            class="row player-badge"
        >
            <div class="col">
                <div class="row leaderboard-header text-start">
                    <div class="col">
                        #{{ index + 1 }} -
                        {{ game.getUserDisplayName(player.playerId) }}
                    </div>
                </div>
                <div class="row badge-row text-start">
                    <div class="col-7">
                        <span class="highlight"
                            >Current Records:
                            {{ player.currentRecordTotal }} </span
                        ><br />
                        Total Record Improvements:
                        {{ player.recordImprovementTotal }} <br />
                        Total Submissions: {{ player.times.length }}
                    </div>
                    <div v-if="player.getFavoriteRun()" class="col-5">
                        Favorite Run: <br />
                        {{ player.getFavoriteRun().displayName }}
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
        players() {
            const first = _.orderBy(
                this.game.player,
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

.player-badge {
    margin: 30px;
}

.badge-row {
    margin: 5px;
}
</style>
