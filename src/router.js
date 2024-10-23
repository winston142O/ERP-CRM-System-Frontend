import { useToast } from "vue-toastification";
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/authStore';
import authRoutes from './routes/authRoutes';
import homeRoutes from './routes/homeRoutes'; 
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";

const routes = [
    ...authRoutes,
    ...homeRoutes,
    ...adminRoutes,
    ...userRoutes,
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
router.beforeEach(async (to, from, next) => {
    // Initialize the auth store
    const authStore = useAuthStore();

    // Await the promises
    const isAuthenticated = await authStore.isAuthenticated;
    const isAuthAdmin = await authStore.isAuthAdmin;

    // Verify that the user is authenticated
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (!isAuthAdmin) {
            next({
                path: '/home',
                query: { redirect: to.fullPath }
            });
            const toast = useToast();
            toast.error('You are not authorized to view this page.', {
                timeout: 2500,
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
