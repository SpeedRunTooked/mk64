import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import FrontPageView from '../views/FrontPageView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'frontpage',
        component: FrontPageView,
    },
    {
        path: '/submit',
        name: 'submit',
        component: () => import('../views/SubmitTimeView.vue'),
    },
    {
        path: '/data',
        name: 'data',
        component: () => import('../views/FullDataView.vue'),
    },
    {
        path: '/leaderboard',
        name: 'leaderboard',
        component: () => import('../views/LeaderboardView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
