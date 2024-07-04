<template>
<div class="page">
    <SideBar />
    <div class="page-content" :style="{ 'margin-left': sidebarWidthPx }">
        <slot name="contents"></slot>
    </div>
</div>
</template>

    
    
<script>
import SideBar from '../ui/sidebar/SideBar.vue'
import { useSidebarStore } from '@/stores/sidebarStore';
import { computed } from 'vue';

export default {
    components: {
        SideBar
    },
    setup() {
        const sidebarStore = useSidebarStore();
        const sidebarWidthPx = computed(() => sidebarStore.sidebarWidthPx);

        return {
            sidebarWidthPx
        };
    }
}
</script>

<style scoped>
.page-content {
    margin-top: 2.5em;
    padding: 1em;
    transition: 0.3s ease;
}

.page {
    height: 100vh;
}
</style>
