<script setup lang="ts">
import _ from 'lodash';
import { User } from '@/game/User';
import { Game } from '@/game/Game';
import { useStore } from 'vuex';
import { computed } from '@vue/reactivity';
import { Score } from '@/game/Score';

const game = computed<Game>(() => useStore().state.game);

const users = computed((): User[] => {
    return _.orderBy(
        game.value.users,
        ['currentRecordTotal', 'recordImprovementTotal'],
        ['desc', 'desc'],
    );
});
</script>

<template>
    <div class="section-container mx-auto">
        <div
            v-for="(user, index) in users"
            :key="user.id"
            class="row user-badge"
            :v-if="users.length > 0"
        >
            <div class="col">
                <div class="row leaderboard-header text-start">
                    <div class="col">
                        #{{ index + 1 }} -
                        {{ game.getUser(user.id).displayName }}
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
                        Total Submissions: {{ user.entries.length }}
                    </div>

                    <div v-if="user.favoriteRun" class="col-5">
                        <div v-if="user.totalScore > 0">
                            Total Score:
                            {{ Score.addCommas(String(user.totalScore)) }}
                        </div>
                        Favorite Run: <br />
                        {{ user.favoriteRun.displayName }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.leaderboard-header {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid grey;
}

.user-badge {
    margin: 0 30px 40px 40px;
}

.badge-row {
    margin: 5px;
}
</style>
