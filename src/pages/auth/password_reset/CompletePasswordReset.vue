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
                <PassWordField v-model="newPassword" />
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
import PassWordField from '../../../components/ui/forms/PasswordField.vue';

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
    mounted() {
        this.enableSubmitButton();
    },
    components: {
        AuthLayout,
        PassWordField
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
                    this.enableSubmitButton();
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