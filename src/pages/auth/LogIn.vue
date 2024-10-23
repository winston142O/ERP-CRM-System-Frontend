<template>
<AuthLayout>
    <template v-slot:auth-img>
        <img src="../../../public/static/imgs/dashboard_3d.png" alt="dashboard_3d" class="img-fluid" style="height: 100%; object-fit: contain;" />
    </template>
    <template v-slot:auth-content>
        <h1 style="color: black" class="card-title">Management, simplified</h1>
        <p style="margin-bottom: 30px;" class="card-text">Sign into your account to get some work done!</p>
        <form style="line-height: 2.5;" @submit.prevent="loginUser">
            <div style="display: flex; flex-direction: column; align-items: flex-start;" class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" v-model="username" placeholder="Type in your username here..." required>
                <PassWordField v-model="password" />
            </div>
            <button id="login-btn" style="margin-top: 15px; width: 100%; transition: all 0.3s ease" type="submit" class="btn btn-primary">
                <div v-if="loading" class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div v-else>
                    Sign In
                </div>
            </button>
            <span style="width: 100%; display: flex; justify-content: flex-end;">
                <router-link :to="'/reset-password'" class="link" style="text-align: right; width: auto; display: block; margin-top: 7.5px;">
                    Forgot your password?
                </router-link>
            </span>
        </form>
        <div class="mt-3" style="line-height: 0.5; margin-top: 100px !important">
            <p>Don't have an account?</p>
            <router-link :to="'/request-account'" class="link" style="width: auto; display: block; margin-top: 7.5px;">
                Request an account to your organization
            </router-link>
        </div>
    </template>
</AuthLayout>
</template>

<script>
import axios from 'axios';
import { useToast } from "vue-toastification";
import AuthLayout from '../../components/layouts/AuthLayout.vue';
import { useAuthStore } from '@/stores/authStore';
import PassWordField from '../../components/ui/forms/PasswordField.vue';

export default {
    components: {
        AuthLayout,
        PassWordField
    },
    async mounted() {
        // Check if the user is already authenticated
        const authStore = useAuthStore();
        const isAuthenticated = await authStore.isAuthenticated;

        if (isAuthenticated) {
            this.$router.push('/home');
        }
        document.getElementById('login-btn').disabled = false;
    },
    data() {
        return {
            username: '',
            password: '',
            showPassword: false,
            toast: useToast(),
            loading: false
        };
    },
    methods: {
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
        loginUser() {
            const baseAPI_URL = process.env.VUE_APP_DJANGO_API_URL;

            // Disable the login button and set a loading state on the button
            document.getElementById('login-btn').disabled = true;
            this.loading = true;

            axios.post(`${baseAPI_URL}/auth/login/`, {
                username: this.username,
                password: this.password,
            })
            .then(response => {
                // Retrieve the user_id, access, and refresh tokens from the response
                let userData = {
                    userId: response.data.user_id,
                    employeeId: response.data.employee_id,
                    accessToken: response.data.access,
                    refreshToken: response.data.refresh
                };

                // Retrieve the user role data
                let roleData = {
                    department: response.data.role.department,
                    title: response.data.role.title,
                };

                // Store the user_id, access, and refresh tokens in the Pinia store
                const authStore = useAuthStore();
                authStore.login(userData, roleData);
                
                this.toast.success('You have successfully logged in!', {
                    timeout: 2500
                });
                this.$router.push('/home');
            })
            .catch((error) => {
                // Display a toast message to the user
                let message = 'An error occurred while trying to log in. Please try again later.';

                // Check if the error object has a response and then check the status
                if (error.response && error.response.status === 400) {
                    message = 'Invalid username or password. Please try again.';
                }

                this.toast.error(message, {
                    timeout: 5000
                });

                // Enable the login button and set the loading state on the button to false
                this.loading = false;
                setTimeout(() => {
                    document.getElementById('login-btn').disabled = false;
                }, 3000);
            });
        }
    },
};
</script>
