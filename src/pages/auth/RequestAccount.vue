<template>
<AuthLayout>
    <template v-slot:auth-img>
        <img src="../../../public/static/imgs/form_3d.png" alt="dashboard_3d" class="img-fluid" style="height: 100%; width: 90%; object-fit: contain;" />
    </template>
    <template v-slot:auth-content>
        <h1 style="color: black; margin-bottom: 15px;" class="card-title">Request an Account</h1>
        <p style="margin-bottom: 30px;" class="card-text">Submit the following data in order to request an account to your organization.</p>

        <transition name="fade">
            <form v-if="!submitted" @submit.prevent="submitForm" style="line-height: 2.5; text-align: left;">
                <label for="firstName">First Name</label>
                <input type="text" class="form-control" id="first-name" v-model="newUser.firstName" placeholder="Type in your first name here..." required>

                <label for="lastName">Last Name</label>
                <input type="text" class="form-control" id="last-name" v-model="newUser.lastName" placeholder="Type in your last name here..." required>

                <label for="username">Username</label>
                <input type="text" class="form-control" id="user-name" v-model="newUser.username" placeholder="Type in your username here..." required>

                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" v-model="newUser.email" placeholder="Type in your email here..." required>

                <button id="request-acc-btn" style="margin-top: 15px; width: 100%; transition: all 0.3s ease" type="submit" class="btn btn-primary">
                    <div v-if="loading" class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div v-else>
                        Request an Account
                    </div>
                </button>
            </form>
        </transition>

        <div class="mt-3" style="line-height: 0.5; margin-top: 100px !important">
            <p>Already have an account?</p>
            <router-link :to="'/login'" class="link" style="width: auto; display: block; margin-top: 7.5px;">
                Login
            </router-link>
        </div>
    </template>
</AuthLayout>
</template>

<script>
import { useToast } from "vue-toastification";
import axios from 'axios';
import AuthLayout from '../../components/layouts/AuthLayout.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
    components: {
        AuthLayout
    },
    async mounted() {
        // Check if the user is already authenticated
        const authStore = useAuthStore();
        const isAuthenticated = await authStore.isAuthenticated;

        if (isAuthenticated) {
            this.$router.push('/home');
        }
        document.getElementById('request-acc-btn').disabled = false;
    },
    data() {
        return {
            newUser: {
                firstName: '',
                lastName: '',
                email: '',
                username: '',
            },
            loading: false,
            submitted: false,
            toast: useToast(),
        };
    },
    methods: {
        submitForm() {
            const baseAPI_URL = process.env.VUE_APP_DJANGO_API_URL;

            // Disable the Request button and set a loading state on the button
            document.getElementById('request-acc-btn').disabled = true;
            this.loading = true;
            
            axios.post(`${baseAPI_URL}/auth/request-account/`, {
                "username": this.newUser.username,
                "email": this.newUser.email,
                "first_name": this.newUser.firstName,
                "last_name": this.newUser.lastName,
            })
            .then(() => {
                this.submitted = true;
                this.loading = false;

                let message = 'Your request has been submitted. Please wait for approval. You will receive an email once your account has been approved.';
                this.toast.success(message, {
                    timeout: 5000
                });
            })
            .catch((error) => {
                // Get the error message from the response
                let errors = Object.values(error.response.data).find(value => Array.isArray(value));
                
                // Display the first error message
                let message = errors[0];

                // Replace the error message with a more user-friendly message
                if (message.includes('sign up approval queue with this email already exists.')) {
                    message = 'A request to create an account with this email already exists. Please wait for approval.';
                }

                this.toast.error(message, {
                    timeout: 5000
                });
                
                // Enable the Request button
                this.loading = false;
                document.getElementById('request-acc-btn').disabled = false;
            });
        }
    },
};
</script>