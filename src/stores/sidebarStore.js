import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        collapsed: JSON.parse(localStorage.getItem('sidebarCollapsed')) || false,
        SIDEBAR_WIDTH: 220,
        SIDEBAR_WIDTH_COLLAPSED: 60,
    }),
    actions: {
        toggleSidebar() {
            localStorage.setItem('sidebarCollapsed', !this.collapsed);
            this.collapsed = !this.collapsed;
        }
    },
    getters: {
        sidebarWidthPx() {
            return `${this.collapsed ? this.SIDEBAR_WIDTH_COLLAPSED : this.SIDEBAR_WIDTH}px`
        }
    }
});