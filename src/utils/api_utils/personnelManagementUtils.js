import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';

const baseAPI_URL = process.env.VUE_APP_DJANGO_API_URL;
const toast = useToast();

export async function populateRoleDropdowns() {
    /* This function is used to populate the departments and titles dropdowns. */

    const authStore = useAuthStore();
    let departments = [];
    let titles = [];
    
    if (await authStore.ensureValidToken(authStore)) {
        try {
            const response = await axios.get(`${baseAPI_URL}/personnel/dropdown-options/`, {
                headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
            });

            // Get the departments
            departments = response.data.departments;
            
            // Extract the titles from each department
            departments.forEach(department => {
                titles.push(...department.titles);
            });

            return { departmentOpts: departments, titleOpts: titles };
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching departments and roles. Please try again later.', {
                timeout: 3500,
            });
            return { departmentOpts: [], titleOpts: [] };
        }
    } else {
        toast.error('Unable to fetch departments and roles due to authentication issues. Please log in again.', {
            timeout: 3500,
        });
        return { departmentOpts: [], titleOpts: [] };
    }
}