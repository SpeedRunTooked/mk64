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
                    <div class="col-7">
                        <span class="highlight"
                            >Current Records:
                            {{ player.currentRecordTotal }} </span
                        ><br />
                        Total Record Improvements:
                        {{ player.recordImprovementTotal }} <br />
                        Total Submissions: {{ player.times.length }}
                    </div>
                    <div class="col-5">
                        Favorite Run: <br />
                        {{ displayFavoriteCategory(player) }}
                        {{ displayFavoriteSubcategory(player) }}
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
    methods: {
        displayFavoriteCategory(player) {
            const fav = this.data.getCategoryName(
                player.getFavoriteSubcategory().split(':')[0],
            );
            return fav === '' ? 'None yet!' : fav;
        },
        displayFavoriteSubcategory(player) {
            const fav = this.data.getSubcategoryName(
                player.getFavoriteSubcategory().split(':')[0],
                player.getFavoriteSubcategory().split(':')[1],
            );
            return fav || '';
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
