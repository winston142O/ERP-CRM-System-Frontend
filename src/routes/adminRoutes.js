export default [
    {
        path: '/admin-dashboard',
        name: 'AdminDashboard',
        component: () => import('../pages/personnel_management/AdminDashboard.vue'),
        meta: { requiresAdmin: true },
    },
    {
        path: '/sign-up-approval-queue',
        name: 'SignUpApprovalQueue',
        component: () => import('../pages/personnel_management/sign_up_approval/SignUpApprovalQueue.vue'),
        meta: { requiresAdmin: true },
    }
];