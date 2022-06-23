<template>
    <div class="section-container mx-auto">
        <!-- <div v-for="cup in data.api.gamedata.cups" :key="cup.slug">


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
        </div> -->

        <div v-for="category in data.categories" :key="category.slug">
            <div class="section-header">{{ category.name }} Record Summary</div>
            <div class="row">
                <div class="col category-header">
                    {{ category.subcategoryName }}
                </div>
                <div class="col category-header">Time</div>
                <div class="col category-header">Player</div>
            </div>
            <div
                v-for="subcategory in category.subcategories"
                :key="subcategory.slug"
                class="row subcategory-row"
            >
                <div class="col">{{ subcategory.name }}</div>
                <div class="col">
                    {{
                        data.getRecord(subcategory.slug, category.slug)
                            ?.timeElapsed
                    }}
                </div>
                <div class="col">
                    {{
                        data.getRecord(subcategory.slug, category.slug)
                            ?.userDisplayName
                    }}
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
.category-header {
    font-weight: bold;
    padding: 0px 0 10px 0;
    border-bottom: 1px solid lightgrey;
}

.displayName {
    font-size: 14px;
}
</style>
