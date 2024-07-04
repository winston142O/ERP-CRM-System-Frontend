export default [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../pages/auth/LogIn.vue'),
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('../pages/auth/password_reset/RequestPasswordReset.vue'),
    },
    {
        path: '/complete-password-reset/:uid/:token',
        name: 'CompletePasswordReset',
        component: () => import('../pages/auth/password_reset/CompletePasswordReset.vue'),
    }
];
