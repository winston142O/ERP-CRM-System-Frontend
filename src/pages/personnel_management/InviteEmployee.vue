<template>
<SidebarLayout>
    <template v-slot:contents>
        <div class="two-column-layout">
            <div class="form-container">
                <h1 style="font-weight: bold; text-align: center; margin-bottom: 20px; margin-top: 0px;">Invite a New User</h1>
                <p>
                    Fill out the form below in order to send an account invitation email to the person in question.
                    They will be able to activate their account uppon receiving this email.
                </p>
                <form style="line-height: 2.5;" @submit.prevent="inviteEmployee">
                    <div style="display: flex; flex-direction: column; align-items: flex-start;" class="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" class="form-control" id="first_name" v-model="newEmployee.firstName" placeholder="Type in your first name here..." required>
        
                    <label for="last_name">Last Name</label>
                    <input type="text" class="form-control" id="last_name" v-model="newEmployee.lastName" placeholder="Type in your last name here..." required>
        
                    <label for="department">Select Department:</label>
                    <v-select
                        style="width: 100%;"
                        :options="departments"
                        v-model="newEmployee.departmentId"
                        label="department_name"
                        :reduce="department => department.id"
                        placeholder="Select a department"
                    ></v-select>
        
                    <label for="title">Select Title:</label>
                    <v-select
                        style="width: 100%;"
                        :options="titles"
                        v-model="newEmployee.titleId"
                        label="title_name"
                        :reduce="title => title.id"
                        placeholder="Select a title"
                    ></v-select>
    
                    <label for="email">Email</label>
                    <input type="text" class="form-control" id="username" v-model="newEmployee.email" placeholder="Type in your username here..." required>
    
                    </div>
                    <button id="invite-btn" style="margin-top: 40px; height: 40px; width: 100%; transition: all 0.3s ease" type="submit" class="btn btn-primary">
                    <div v-if="loading" class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div v-else>
                        Send invite
                    </div>
                    </button>
                </form>
            </div>
            <img src="../../../public/static/imgs/paper_plane_3d.png" style="align-self: center;" alt="paper_plane_3d" class="img-fluid paper-img" />
        </div>
    </template>
</SidebarLayout>
</template>

<script>
import { useToast } from 'vue-toastification';
import SidebarLayout from '@/components/layouts/SidebarLayout.vue';
import { populateRoleDropdowns } from '@/utils/api_utils/personnelManagementUtils';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

export default {
    components: {
        SidebarLayout,
    },
    name: 'EmployeeList',
    data() {
        return {
            toast: useToast(),
            authStore: useAuthStore(),
            departments: [],
            titles: [],
            newEmployee: {
                firstName: '',
                lastName: '',
                departmentId: '',
                titleId: '',
                email: '',
            },
            baseAPI_URL: process.env.VUE_APP_DJANGO_API_URL,
            approveCurrentRequest: false,
            loading: false,
        };
    },
    async mounted() {
        // Retrieve the dropdown options for departments and titles
        let dropdownOpts = await this.populateRoleDropdowns();
        this.departments = dropdownOpts.departmentOpts;
        this.titles = dropdownOpts.titleOpts;
        
        // Push the user back to the previous page if the titles and departments are not populated
        if (this.departments.length === 0 || this.titles.length === 0) {
            this.$router.push('/admin-dashboard');
        }
    },
    methods: {
        populateRoleDropdowns,
        wipeForm() {
            this.newEmployee = {
                firstName: '',
                lastName: '',
                departmentId: '',
                titleId: '',
                email: '',
            };
        },
        async inviteEmployee() {
            this.loading = true;
            console.log(this.newEmployee);

            axios.post(`${this.baseAPI_URL}/auth/invite-user/`, 
                {
                    first_name: this.newEmployee.firstName,
                    last_name: this.newEmployee.lastName,
                    email: this.newEmployee.email,
                    department_id: this.newEmployee.departmentId,
                    title_id: this.newEmployee.titleId,
                    username: this.newEmployee.username,
                },
                {
                    headers: { 'Authorization': `Bearer ${this.authStore.accessToken}` }
                }
            )
            .then(response => {
                console.log(response.data);
                
                this.toast.success('Employee invitation sent successfully');
                this.wipeForm();
            })
            .catch(error => {
                this.toast.error(error.response.data.message);
            });

            this.loading = false;
        },
    }
}
</script>

<style scoped>
@import '../../../public/static/css/element_styling.css';

.page-content {
    margin-top: 5px;
    transition: 0.3s ease;
}

.action-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-left: 2%;
}

h1 {
    color: #0D6EFD;
}

.form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 20px;
    width: 40%;
}

.paper-img {
    margin-top: 75px;
    height: auto;
    width: 30%;
    object-fit: contain;
}

@media screen and (max-width: 955px) {
    .paper-img {
        width: 50%;
    }
    .form-container {
        width: 85%;
    }
}


</style>
