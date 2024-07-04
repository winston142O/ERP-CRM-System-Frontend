import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        collapsed: false,
        SIDEBAR_WIDTH: 220,
        SIDEBAR_WIDTH_COLLAPSED: 60,
    }),
    actions: {
        toggleSidebar() {
            this.collapsed = !this.collapsed;
            console.log('Sidebar collapsed:', this.collapsed);
        }
    },
    getters: {
        sidebarWidthPx() {
            return `${this.collapsed ? this.SIDEBAR_WIDTH_COLLAPSED : this.SIDEBAR_WIDTH}px`
        }
    }
});