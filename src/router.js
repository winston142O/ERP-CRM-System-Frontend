import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const routes = [
    {
        path: '/home',
        name: 'HomeMenu',
        component: () => import('./pages/HomeMenu.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('./pages/auth/LogIn.vue'),
        // meta: { transition: 'fade' },
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('./pages/auth/password_reset/RequestPasswordReset.vue'),
    },
    {
        path: '/complete-password-reset/:uid/:token',
        name: 'CompletePasswordReset',
        component: () => import('./pages/auth/password_reset/CompletePasswordReset.vue'),
    },
    {
        path: '/not-found',
        name: 'NotFound',
        component: () => import('./pages/NotFound.vue'),
    },
    {
        path: '/:pathMatch(.*)*', // 404
        redirect: '/not-found',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Redirect to login if not authenticated
router.beforeEach((to, from, next) => {
    // Initialize the auth store
    const authStore = useAuthStore();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authStore.isAuthenticated) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
