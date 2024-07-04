<template>
    <AuthLayout>
        <template v-slot:auth-img>
            <img src="../../../../public/static/imgs/lock_3d.png" alt="lock3d" class="img-fluid"
                style="height: 100%; width: 60%; object-fit: contain;" />
        </template>
        <template v-slot:auth-content>
            <h1 style="color: black" class="card-title">Set your new password</h1>
            <p style="margin-bottom: 30px; margin-top: 25px;" class="card-text">You can change your password by
                completing the following form:</p>
            <form style="line-height: 2.5;" @submit.prevent="submitPasswordReset">
                <div style="display: flex; gap: 15px; justify-content: space-between; align-items: center;">
                    <label for="password">New Password</label>
                    <transition name="bounce">
                        <p class="warning-text" v-if="showPassword" style="margin-bottom: 0px">
                            Password is visible!
                        </p>
                    </transition>
                </div>
                <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password"
                        v-model="newPassword" placeholder="Type in your password here..." required>
                    <div class="input-group-append password-show-btn">
                        <button type="button" class="btn btn-outline-primary"
                            style="height: 100%; border-radius: 0px 10px 10px 0px;" @click="toggleShowPassword">
                            <span class="show-password-span" v-if="showPassword">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-eye-slash" viewBox="0 0 16 16" stroke-width="1">
                                    <path
                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                    <path
                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                    <path
                                        d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                </svg>
                            </span>
                            <span class="show-password-span" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-eye" viewBox="0 0 16 16" stroke-width="1">
                                    <path
                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                    <path
                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
                <button id="sub-btn" style="margin-top: 15px; width: 100%; margin-bottom: 15px;" type="submit"
                    class="btn btn-primary">
                    <div v-if="loading" class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div v-else>
                        Change Password
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
            newPassword: '',
            showPassword: false,
            uid: this.$route.params.uid,
            token: this.$route.params.token,
            passwordResetSuccess: false,
            loading: false
        }
    },
    components: {
        AuthLayout
    },
    methods: {
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
        enableSubmitButton() {
            // Enable the login button and set a loading state on the button
            this.loading = false;
            setTimeout(() => {
                document.getElementById('sub-btn').disabled = false;
            }, 3000)
        },
        submitPasswordReset() {
            const baseAPI_URL = process.env.VUE_APP_DJANGO_API_URL;
            const toast = useToast();

            // Disable the login button and set a loading state on the button
            document.getElementById('sub-btn').disabled = true;
            this.loading = true;

            if (this.passwordResetSuccess) {
                toast.error('You have already reset your password. Please login with your new password.', {
                    timeout: 5000
                });
                this.enableSubmitButton();
                return;
            } else if (this.newPassword.length < 8) {
                toast.error('Password must be at least 8 characters long.', {
                    timeout: 5000
                });
                this.enableSubmitButton();
                return;
            }

            axios.post(`${baseAPI_URL}/auth/confirm-reset-password/?uid=${this.uid}&token=${this.token}`, {
                new_password: this.newPassword,
            })
                .then(() => {
                    let message = 'Ypur password has been successfully reset. You can now login with your new password.';
                    toast.success(message, {
                        timeout: 5000
                    });

                    // Disable the button after the password has been reset
                    this.newPassword = '';
                    this.passwordResetSuccess = true;
                })
                .catch(() => {
                    let message = 'An error occurred while processing your information. Please try again later.';                    
                    toast.error(message, {
                        timeout: 5000
                    });
                    this.enableSubmitButton();
                });
        }
    }
}
</script>

<style scoped>
@import '../../../../public/static/css/transitions.css';

.password-show-btn {
    cursor: pointer;
    transition: hover 0.5s ease;
}

.warning-text {
    font-size: 0.75rem;
    color: #ff0019;
}
</style>