<template>
    <div v-if="route.params.gameId" class="container">
        <game-loader :gameId="route.params.gameId"></game-loader>
    </div>
    <div v-else class="container">
        <front-page-view></front-page-view>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import FrontPageView from './views/FrontPageView.vue';
import GameLoader from './components/GameLoader.vue';

const route = useRoute();
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

a {
    color: #2c3e50;

    &.router-link-exact-active {
        color: #42b983;
    }
    margin-left: 5px;
    margin-right: 5px;
}

nav {
    a {
        font-weight: bold;
    }
    padding: 30px;

    font-size: 18px;
}

a:link {
    text-decoration: none;
}

a:visited {
    text-decoration: none;
}

a:hover {
    text-decoration: none;
}

a:active {
    text-decoration: none;
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
    a {
        color: #42b983;
    }
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
    max-height: 100px;
    margin-top: 10px;
}

.page-wrapper {
    margin-top: 15px;
}

.filter-row {
    margin-bottom: 20px;
}

.material-symbols-outlined {
    max-width: 24px;
    overflow: hidden;
}
</style>
