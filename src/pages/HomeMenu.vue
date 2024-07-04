<template>
<SidebarLayout>
    <template v-slot:contents>
        <!-- TODO: Define menu -->
        <h1>Home Menu</h1>
        <p>Welcome to the Home Menu page!</p>
    </template>
</SidebarLayout>
</template>

<script>
import SidebarLayout from '@/components/layouts/SidebarLayout.vue';

export default {
    components: {
        SidebarLayout
    },
    name: 'HomeMenu'
}
</script>

<style scoped>
.page-content {
    margin-top: 2.5em;
    padding: 1em;
    transition: 0.3s ease;
}
</style>
