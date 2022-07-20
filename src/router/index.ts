import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import SummaryPageView from '../views/SummaryPageView.vue';
import FrontPageView from '../views/FrontPageView.vue';
import SubmitEntryView from '../views/SubmitEntryView.vue';
import FullDataView from '../views/FullDataView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';
import StatsPageView from '../views/StatsPageView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'frontpage',
        component: FrontPageView,
    },
    {
        path: '/:gameId',
        name: 'summary',
        component: SummaryPageView,
    },
    {
        path: '/:gameId/submit',
        name: 'submit',
        component: SubmitEntryView,
    },
    {
        path: '/:gameId/data',
        name: 'data',
        component: FullDataView,
    },
    {
        path: '/:gameId/leaderboard',
        name: 'leaderboard',
        component: LeaderboardView,
    },
    {
        path: '/:gameId/stats',
        name: 'stats',
        component: StatsPageView,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
