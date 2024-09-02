<template>
<SidebarLayout>
    <template v-slot:contents>
        <h1 style="font-weight: bold; text-align: left; margin-left: 2%; margin-bottom: 50px; margin-top: 0px;">Administrator Menu</h1>
        <div class="action-list">
            <MenuActionCard to="/sign-up-approval-queue" icon="fa-solid fa-person-circle-check">
                <template v-slot:action-title>
                    <h3 style="font-weight: bold;">Approve Sign-up Requests</h3>
                </template>
                <template v-slot:action-body-content>
                    <p>Review new accounts and set their roles</p>
                </template>
            </MenuActionCard>
            
            <MenuActionCard to="/employee-list" icon="fa-solid fa-address-book">
                <template v-slot:action-title>
                    <h3 style="font-weight: bold;">Employee List</h3>
                </template>
                <template v-slot:action-body-content>
                    <p>Review the list of employees currently enrolled in the Software system.</p>
                </template>
            </MenuActionCard>
            
            <MenuActionCard to="/personnel_management/invite-new-employee" icon="fa-solid fa-envelope">
                <template v-slot:action-title>
                    <h3 style="font-weight: bold;">Invite New User</h3>
                </template>
                <template v-slot:action-body-content>
                    <p>Manually enroll and invite a new employee to the Software system.</p>
                </template>
            </MenuActionCard>
            
        </div>
    </template>
</SidebarLayout>
</template>

<script>
import SidebarLayout from '@/components/layouts/SidebarLayout.vue';
import MenuActionCard from '@/components/ui/MenuActionCard.vue';

export default {
    components: {
        SidebarLayout,
        MenuActionCard
    },
    name: 'AdminDashboard'
}
</script>

<style scoped>
.page-content {
    margin-top: 5px;
    transition: 0.3s ease;
}

.action-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-left: 2%;
    gap: 25px;
}

h1 {
    color: #0D6EFD;
}
</style>
