import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userId: JSON.parse(localStorage.getItem('user')) || null,
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
    }),
    actions: {
        setUserId(user) {
            this.userId = user;
        },
        setAccessToken(token) {
            this.accessToken = token;
        },
        setRefreshToken(token) {
            this.refreshToken = token;
        },
        checkTokenValidity() {
            if (this.accessToken) {
                try {
                    const decodedToken = jwtDecode(this.accessToken);
                    if (Date.now() >= decodedToken.exp * 1000) {
                        // Token has expired, perform logout
                        this.logout();
                        return false; // Token is not valid
                    }
                    return true; // Token is valid
                } catch (error) {
                    console.error('Error decoding JWT:', error);
                    this.logout();
                    return false; // Token is not valid
                }
            }
            return false; // No token available
        },
        refreshToken() {
            if (this.refreshToken) {
                // Make a request to refresh the access token
                axios.post('/auth/refresh/', { refresh: this.refreshToken })
                    .then(response => {
                        this.accessToken = response.data.access;
                        localStorage.setItem('accessToken', this.accessToken);
                    })
                    .catch(() => {
                        this.logout();
                    });
            }
        },
        login(userData) {
            this.userId = userData.userId;
            this.accessToken = userData.accessToken;
            this.refreshToken = userData.refreshToken;
            
            localStorage.setItem('user', JSON.stringify(this.userId));
            localStorage.setItem('accessToken', this.accessToken);
            localStorage.setItem('refreshToken', this.refreshToken);
        },
        logout() {
            this.userId = null;
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            console.log('Logged out');
        }
    },
    getters: {
        // Check that there is a valid token
        isAuthenticated() {
            return this.accessToken && this.checkTokenValidity();
        }
    },
});

// Set up Axios interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        const authStore = useAuthStore();
        if (error.response && error.response.status === 401) {
            authStore.logout();
        }
        return Promise.reject(error);
    }
);
