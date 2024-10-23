<template>
    <SidebarLayout>
        <template v-slot:contents>
            <h1 style="font-weight: bold; text-align: left; margin-bottom: 25px; margin-top: 0px;">My Profile</h1>
        </template>
    </SidebarLayout>
</template>

<script>
// import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import SidebarLayout from '@/components/layouts/SidebarLayout.vue';

export default {
    components: {
        SidebarLayout,
    },
    name: 'MyProfile',
    data() {
        return {
            authStore: useAuthStore(),
            toast: useToast(),
            baseAPI_URL: process.env.VUE_APP_DJANGO_API_URL,
        }
    },
    async mounted() {
        // const userId = this.authStore.user;

        // Retrieve profile information
        // const url = `${this.baseAPI_URL}/personnel/employees/`
        // axios.get(url, {
        //     headers: { Authorization: `Bearer ${this.authStore.accessToken}` },
        //     params: { employee_id: userId }
        // }).then(response => {
        //     console.log(response.data);
        // }).catch(error => {
        //     console.error(error);
        //     this.toast.error('An error occurred while retrieving your profile information.');
        // });
    }
}
</script>

<style scoped>
@import '../../../public/static/css/element_styling.css';
@import '../../../public/static/css/transitions.css';

.page-content {
    margin-top: 5px;
    padding: 1em;
    transition: 0.3s ease;
}

h1 {
    color: #0D6EFD;
}
</style>