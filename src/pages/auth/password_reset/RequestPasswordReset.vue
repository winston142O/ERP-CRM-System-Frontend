<template>
    <AuthLayout>
        <template v-slot:auth-img>
            <img src="../../../../public/static/imgs/lock_3d.png" alt="lock3d" class="img-fluid"
                style="height: 100%; width: 40%; object-fit: contain;" />
        </template>
        <template v-slot:auth-content>
            <h1 style="color: black" class="card-title">Forgot your password?</h1>
            <p style="margin-bottom: 30px; margin-top: 25px;" class="card-text">We will send you an email with a way
                for you change your login credentials.</p>
            <form style="line-height: 2.5;" @submit.prevent="sendResetPasswordEmail">
                <div style="display: flex; flex-direction: column; align-items: flex-start;" class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email"
                        placeholder="Type in your email here..." required>
                </div>
                <button id="req-btn" style="margin-top: 15px; width: 100%; margin-bottom: 15px;" type="submit"
                    class="btn btn-primary">
                    <div v-if="loading" class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div v-else>
                        Request Password Reset
                    </div>
                </button>
                <router-link :to="'/login'" class="link">Back to login</router-link>
            </form>
        </template>
    </AuthLayout>
</template>

<script>
import axios from 'axios';
import { useToast } from "vue-toastification";
import AuthLayout from '../../../components/layouts/AuthLayout.vue';

export default {
    name: 'PasswordReset',
    data() {
        return {
            email: '',
            loading: false
        }
    },
    components: {
        AuthLayout
    },
    methods: {
        sendResetPasswordEmail() {
            const baseAPI_URL = process.env.VUE_APP_DJANGO_API_URL;

            // Disable the login button and set a loading state on the button
            document.getElementById('req-btn').disabled = true;
            this.loading = true;

            axios.post(`${baseAPI_URL}/auth/reset-password/`, {
                email: this.email,
            })
                .then(() => {
                    const toast = useToast();
                    let message = 'An email has been sent to you with instructions on how to reset your password. Check your email!';
                    toast.success(message, {
                        timeout: 5000
                    });
                    this.loading = false;
                })
                .catch(() => {
                    const toast = useToast();
                    let message = 'An error occurred while processing your information. Please try again later.';
                    toast.error(message, {
                        timeout: 5000
                    });

                    // Enable the login button and set a loading state on the button
                    this.loading = false;
                    setTimeout(() => {
                        document.getElementById('req-btn').disabled = false;
                    }, 3000)
                });
        }
    }
}
</script>

<style scoped>
@media screen and (max-width: 1076px) {
    #img-col {
        display: block;
        width: 60% !important;
    }
}
</style>
