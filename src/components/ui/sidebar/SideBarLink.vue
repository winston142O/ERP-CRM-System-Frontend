<template>
    <router-link :to="to" class="sidebar-link" :class="{ active: isActive }">
        <i class="icon" :class="icon" />
        <transition name="fade">
            <span v-if="!collapsed">
                <slot />
            </span>
        </transition>
    </router-link>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebarStore';

export default {
    name: 'SideBarLink',
    props: {
        to: { type: String, required: true },
        icon: { type: String, required: true },
    },
    setup(props) {
        const sidebarStore = useSidebarStore();
        const collapsed = computed(() => sidebarStore.collapsed);

        const route = useRoute();
        const isActive = computed(() => route.path === props.to);
        return {
            collapsed,
            isActive,
        };
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.sidebar-link  {
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

.sidebar-link:hover {
    background-color: var(--sidebar-item-hover);
    transform: scale(1.05);
}

.sidebar-link.active {
    background-color: var(--sidebar-item-active);
}

.sidebar-link.icon {
    flex-shrink: 0;
    width: 25px;
    margin-right: 10px;
}
</style>