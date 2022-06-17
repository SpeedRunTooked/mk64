<template>
    <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/submittime">Submit Time</router-link>
    </nav>
    <router-view />
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
    font-family: Calibri;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
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
}

.section-header {
    font-weight: bold;
    text-align: left;
    font-size: 20px;
    margin-bottom: 10px;
}

.section-container {
    padding: 20px;
}
</style>
