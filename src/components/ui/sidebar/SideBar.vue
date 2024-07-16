<template>
<div class="sidebar" :style="{ width: sidebarWidthPx }" style="box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;">

    <SideBarLink to="/home" icon="fas fa-home">Home</SideBarLink>
    <SideBarLink to="/dashboard" icon="fas fa-columns">Dashboard</SideBarLink>
    <SideBarLink to="/analytics" icon="fas fa-chart-bar">Analytics</SideBarLink>
    <SideBarLink to="/friends" icon="fas fa-users">Friends</SideBarLink>
    <SideBarLink to="/image" icon="fas fa-image">Images</SideBarLink>
    <SideBarLink to="/admin-dashboard" icon="fa-solid fa-gear">Administration</SideBarLink>

    <!-- Logout icon -->
    <span class="logout-icon" @click="showModal = true">
        <i class="fa-solid fa-right-from-bracket fa-lg"></i>
        <transition name="fade">
            <span v-if="!collapsed">
                Logout
            </span>
        </transition>
    </span>

    <!-- Collapse icon -->
    <span class="collapse-icon" @click="toggleSidebar" :class="{ 'rotate-180': collapsed }" style="color: white">
        <i class="fas fa-angle-double-left" />
    </span>

    <!-- PopUpModal Component -->
    <PopUpModal :show="showModal" width="300px">
        <template v-slot:header>
            <div style="display: flex; justify-content: space-between; gap: 90%; align-items: flex-start">
                <h3 style="font-weight: bold; color: #3B5EAB;">Warning!</h3>
                <span class="scale" @click="showModal = false">
                    <i class="fas fa-times" style="cursor: pointer; color: crimson;"></i>
                </span>
            </div>
        </template>

        <template v-slot:body>
            <p style="font-size: large; color: black">Do you really want to logout?</p>
        </template>

        <template v-slot:footer>
            <div style="display: flex; justify-content: center; gap: 10px; width: 100%">
                <button class="btn btn-danger" style="width: 45%" @click="showModal = false">Cancel</button>
                <button class="btn btn-primary" style="width: 45%" @click="logout">Logout</button>
            </div>
        </template>
    </PopUpModal>
</div>
</template>

<script>
import { useSidebarStore } from '@/stores/sidebarStore';
import { computed } from 'vue';
import SideBarLink from './SideBarLink.vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from "vue-toastification";
import PopUpModal from '@/components/ui/PopUpModal.vue';

export default {
    name: 'SideBar',
    components: {
        SideBarLink,
        PopUpModal
    },
    data() {
        return {
            toast: useToast(),
            showModal: false
        };
    },
    setup() {
        const sidebarStore = useSidebarStore();
        const sidebarWidthPx = computed(() => sidebarStore.sidebarWidthPx);
        const collapsed = computed(() => sidebarStore.collapsed);

        return {
            toggleSidebar: sidebarStore.toggleSidebar,
            sidebarWidthPx,
            collapsed,
        };
    },
    methods: {
        logout() {
            const authStore = useAuthStore();
            authStore.logout();


            this.toast.warning('You have been logged out.', {
                timeout: 2500
            });
            this.$router.push('/login');
        }
    }
};
</script>

<style>
:root {
    --sidebar-bg-color: #3B5EAB;
    --sidebar-item-hover: #7695d8;
    --sidebar-item-active: #006eff8a;
}
</style>

<style scoped>
.sidebar {
    color: white;
    background-color: var(--sidebar-bg-color);

    float: left;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0.5em;
    transition: 0.3s ease;

    display: flex;
    flex-direction: column;
}

.sidebar h1 {
    height: 2.5em;
}

.collapse-icon {
    position: absolute;
    bottom: 0;
    padding: 0.75em;
    color: rgba(255, 255, 255, 0.7);
    transition: 0.2s ease;
}

.collapse-icon:hover {
    transform: scale(1.65);
}

.rotate-180 {
    transform: rotate(180deg);
    transition: 0.2s linear;
}

.logout-icon {
    padding: 0.75em;
    color: rgb(255, 255, 255);
    transition: 0.2s ease;
    text-align-last: left;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    font-weight: 400;
    font-size: 20px;
    user-select: none;
    gap: 25px;
    margin: 0.1em 0;
    padding: 0.4em;
    border-radius: 0.25em;
    color: white;
    height: 50px;
    text-decoration: none;
    transition: 0.3s ease;
}

.scale {
    transition: 0.3s ease;
}
.scale:hover {
    transform: scale(1.8);
}

.logout-icon:hover {
    background-color: var(--sidebar-item-hover);
    color: crimson;
    transform: scale(1.05);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
