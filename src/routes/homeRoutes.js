export default [
    {
        path: '/home',
        name: 'HomeMenu',
        component: () => import('../pages/HomeMenu.vue'),
        meta: { requiresAuth: true },
    },
];
