<template>
    <div class="container">
        <div class="row"><div class="col page-title">MK64</div></div>
        <nav>
            <router-link to="/">Summary</router-link> |
            <router-link to="/leaderboard">Leaderboard</router-link> |
            <router-link to="/stats">Stats</router-link> |
            <router-link to="/data">All Entries</router-link> |
            <router-link to="/submit">Submit Time</router-link>
        </nav>
        <router-view />
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import { useStore } from 'vuex';
import { onMounted } from 'vue';

export default defineComponent({
    setup() {
        onMounted(async () => {
            const store = useStore();
            await store.dispatch('getApiData');
        });
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
    margin-bottom: 0px;
    padding: 50px 0 20px 0;
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
    margin-top: 40px;
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
</style>
