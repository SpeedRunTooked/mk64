<template>
    <div v-if="$route.params.gameId" class="container">
        <div class="row">
            <div class="col">
                <img class="logo-img" :src="getLogoUrl()" />
            </div>
        </div>
        <!-- <div class="row"><div class="col page-title">MK64</div></div> -->
        <nav>
            <router-link :to="getRoute('summary')">Summary</router-link> |
            <router-link :to="getRoute('leaderboard')">Leaderboard</router-link>
            | <router-link :to="getRoute('stats')">Stats</router-link> |
            <router-link :to="getRoute('data')">Data</router-link> |
            <router-link :to="getRoute('submit')">Submit</router-link>
        </nav>
        <router-view />
    </div>
    <div v-else class="container">
        <front-page-view></front-page-view>
    </div>
</template>

<script lang="ts">
import FrontPageView from '@/views/FrontPageView.vue';
import { defineComponent } from '@vue/composition-api';
import { useStore } from 'vuex';
import { onMounted } from 'vue';

export default defineComponent({
    components: { FrontPageView },
    setup() {
        onMounted(async () => {
            const store = useStore();
            await store.dispatch('getApiData');
        });
    },
    computed: {
        gameId() {
            return this.$route.params.gameId;
        },
    },
    methods: {
        getRoute(path: string) {
            return `/${this.gameId}/${path}`;
        },
        getLogoUrl() {
            return `https://firebasestorage.googleapis.com/v0/b/mk64-ad77f.appspot.com/o/${this.gameId}%2Fgame-logo.jpg?alt=media`;
        },
    },
});
</script>

<style lang="scss">
#app {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 15px;
}

nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
        margin-left: 5px;
        margin-right: 5px;
    }

    a:link {
        text-decoration: none;
    }

    a:visited {
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    a:active {
        text-decoration: none;
    }

    font-size: 18px;
}

.section-header {
    font-weight: bold;
    text-align: left;
    font-size: 18px;
    margin-bottom: 20px;
}

.section-container {
    width: 600px;
}

.container {
    padding: 20px;
    width: 800px;
    min-width: 600px;
}

.form-select,
.form-control {
    font-size: 14px;
    height: 35px;
}

.page-title {
    font-size: 28px;
    font-weight: 500;
}

.spacer {
    margin-top: 50px;
}
.bold {
    /* color: rgb(158, 0, 0); */
    font-weight: bold;
}
.highlight {
    color: #42b983;
}
.clickable {
    cursor: pointer;
}
.red {
    color: rgb(172, 70, 70);
}
.break-all {
    word-break: break-word;
}
.noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}

.category-header {
    font-weight: bold;
    padding: 0px 0 8px 0;
    border-bottom: 1px solid grey;
    margin-bottom: 8px;
}
.subcategory-row {
    padding: 5px 0;
}

.logo-img {
    width: 100px;
}

.page-wrapper {
    margin-top: 15px;
}

.filter-row {
    margin-bottom: 20px;
}
</style>
