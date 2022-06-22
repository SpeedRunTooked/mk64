<template>
    <div class="section-container mx-auto">
        <div class="section-header">Record Summary</div>

        <div v-for="cup in data.api.gamedata.cups" :key="cup.slug">
            <div class="row cup-row">
                <div class="col text-start cup-header">{{ cup.name }}</div>
                <div class="col cup-header">Fast Lap</div>
                <div class="col cup-header">3 Lap</div>
            </div>

            <div v-for="track in cup.tracks" :key="track.slug">
                <div class="row subcategory-row">
                    <div class="col-1"></div>
                    <div class="col-3 subcateogory-name text-start">
                        {{ track.name }}
                    </div>

                    <div class="col-4">
                        {{
                            data.getRecord(track.slug, 'flap')?.timeElapsed ||
                            ''
                        }}
                        <br />
                        <span class="displayName"
                            >{{
                                data.getRecord(track.slug, 'flap')
                                    ?.userDisplayName || ''
                            }}
                        </span>
                    </div>

                    <div class="col-4">
                        {{
                            data.getRecord(track.slug, '3lap')?.timeElapsed ||
                            ''
                        }}
                        <br />
                        <span class="displayName">
                            {{
                                data.getRecord(track.slug, '3lap')
                                    ?.userDisplayName || ''
                            }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['data']),
    },
};
</script>

<style scoped>
.subcategory-row {
    margin-top: 20px;
}

.cup-row {
    margin-top: 30px;
}
.cup-header {
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid lightgrey;
}

.displayName {
    font-size: 14px;
}
</style>
