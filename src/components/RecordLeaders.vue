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
                        {{ data.getUserDisplayName(player.playerId) }}
                    </div>
                </div>
                <div class="row badge-row text-start">
                    <div class="col-5 highlight">
                        Current Records: {{ player.currentRecordTotal }}
                    </div>
                    <div class="col-7">
                        Total Record Improvements:
                        {{ player.recordImprovementTotal }}
                    </div>
                </div>
                <div class="row badge-row text-start">
                    <div class="col-5">
                        Total Submissions: {{ player.times.length }}
                    </div>
                    <div class="col-7">
                        Favorite Subcategory:
                        {{
                            data.getSubcategoryName(
                                player.getFavoriteSubcategory(),
                            )
                        }}
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
        ...mapState(['data']),
        players() {
            const first = _.orderBy(
                this.data.playerStats,
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
    border-bottom: 1px solid lightgrey;
}

.player-badge {
    margin: 30px;
}

.badge-row {
    margin: 5px;
}
</style>
