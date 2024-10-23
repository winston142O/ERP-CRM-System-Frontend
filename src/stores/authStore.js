import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = process.env.VUE_APP_DJANGO_API_URL;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userId: JSON.parse(localStorage.getItem('user')) || null,
        employeeId: JSON.parse(localStorage.getItem('employee')) || null,
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        department: JSON.parse(localStorage.getItem('department')) || null,
        title: JSON.parse(localStorage.getItem('title')) || null,
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
        async checkTokenValidity() {
            if (this.accessToken) {
                try {
                    await axios.post(`${BASE_URL}/auth/token/verify/`, { token: this.accessToken });
                    return true;
                } catch (error) {
                    return false;
                }
            } else {
                return false; // No token available
            }
        },
        async refreshAccToken() {
            if (this.refreshToken) {
                try {
                    const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: this.refreshToken });
                    this.accessToken = response.data.access;
                    localStorage.setItem('accessToken', this.accessToken);
                } catch (error) {
                    this.logout();
                    throw error;
                }
            } else {
                this.logout();
                throw new Error('No refresh token available');
            }
        },
        login(userData, roleData) {
            const { userId, employeeId, accessToken, refreshToken } = userData;
            const { department, title } = roleData;

            this.userId = userId;
            this.employeeId = employeeId;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.department = department;
            this.title = title;

            localStorage.setItem('user', JSON.stringify(this.userId));
            localStorage.setItem('employee', JSON.stringify(this.employeeId));
            localStorage.setItem('accessToken', this.accessToken);
            localStorage.setItem('refreshToken', this.refreshToken);
            localStorage.setItem('department', JSON.stringify(this.department));
            localStorage.setItem('title', JSON.stringify(this.title));
        },
        logout() {
            this.userId = null;
            this.employeeId = null;
            this.accessToken = null;
            this.refreshToken = null;
            this.department = null;
            this.title = null;

            localStorage.removeItem('user');
            localStorage.removeItem('employee');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('department');
            localStorage.removeItem('title');
        },
        async ensureValidToken() {
            if (!this.checkTokenValidity()) {
                try {
                    await this.refreshAccToken();
                    return this.checkTokenValidity();
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    this.logout();
                    return false;
                }
            }
            return true;
        },
    },
    getters: {
        async isAuthenticated() {
            return await this.checkTokenValidity();
        },
        async isAuthAdmin() {
            return (await this.isAuthenticated) && this.title === 'System Administrator';
        }
    },
});
