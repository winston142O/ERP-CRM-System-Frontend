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
                <div style="display: flex; gap: 15px; justify-content: space-between; align-items: center;">
                    <label for="password">Password</label>
                    <transition name="bounce">
                        <p class="warning-text" v-if="showPassword" style="margin-bottom: 0px">
                            Password is visible!
                        </p>
                    </transition>
                </div>
                <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password" v-model="password" placeholder="Type in your password here..." required>
                    <div class="input-group-append password-show-btn">
                        <button type="button" class="btn btn-outline-primary" style="height: 100%; border-radius: 0px 10px 10px 0px;" @click="toggleShowPassword">
                            <span class="show-password-span" v-if="showPassword">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16" stroke-width="1">
                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                </svg>
                            </span>
                            <span class="show-password-span" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16" stroke-width="1">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
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
            <!-- TODO: Implement Request Account feature -->
            <a href="#">Request an account to your organization</a>
        </div>
    </template>
</AuthLayout>
</template>

<script>
import axios from 'axios';
import { useToast } from "vue-toastification";
import AuthLayout from '../../components/layouts/AuthLayout.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
    components: {
        AuthLayout
    },
    mounted() {
        // Check if the user is already authenticated
        const authStore = useAuthStore();
        if (authStore.isAuthenticated) {
            this.$router.push('/home');
        }
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
                    accessToken: response.data.access,
                    refreshToken: response.data.refresh
                };

                // Store the user_id, access, and refresh tokens in the Pinia store
                const authStore = useAuthStore();
                authStore.login(userData);
                
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

<style scoped>
@import '../../../public/static/css/transitions.css';

.password-show-btn {
    cursor: pointer;
    transition: hover 0.5s ease;
}

.warning-text {
    font-size: 0.75rem;
    color: #ff0019;
}
</style>
