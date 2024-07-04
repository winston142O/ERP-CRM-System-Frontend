import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/authStore';
import authRoutes from './routes/authRoutes';
import homeRoutes from './routes/homeRoutes'; 

const routes = [
    ...authRoutes,
    ...homeRoutes,
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
