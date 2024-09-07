<template>
    <SidebarLayout>
        <template v-slot:contents>
            <h1 style="font-weight: bold; text-align: left; margin-bottom: 25px; margin-top: 0px;">Employee List</h1>
            <div class="table-controllers">
                <div class="search-container" style="width: 100%;">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Search by name..."
                        v-model="filters.searchName"
                    />

                    <input
                        type="text"
                        class="form-control"
                        placeholder="Search by email..."
                        v-model="filters.searchEmail"
                    />
                    
                    <v-select
                        style="width: 100%;"
                        :options="departments"
                        v-model="filters.department"
                        label="department_name"
                        :reduce="department => department.department_name"
                        placeholder="All Departments"
                    ></v-select>
                    
                    <v-select
                        style="width: 100%;"
                        :options="titles"
                        v-model="filters.title"
                        label="title_name"
                        :reduce="title => title.title_name"
                        placeholder="All Titles"
                    ></v-select>
                </div>
                <div class="pagination-container">
                    <button :disabled="previousPage == null" class="btn btn-primary" @click="fetchEmployees(previousPage)">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>

                    <span>Page {{ currentPage }} of {{ totalPages }}</span>

                    <button :disabled="nextPage == null" class="btn btn-primary" @click="fetchEmployees(nextPage)">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table rounded-corners">
                    <thead>
                        <tr>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Department</th>
                            <th scope="col">Title</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="employees.length === 0">
                            <td colspan="6" style="text-align: center;">There are currently no employees.</td>
                        </tr>
                        <tr v-for="employee in employees" :key="employee.id">
                            <td>{{ employee.first_name }}</td>
                            <td>{{ employee.last_name }}</td>
                            <td v-if="employee.email">{{ employee.email }}</td>
                            <td v-else>N/A</td>
                            <td>{{ employee.title }}</td>
                            <td>{{ employee.department }}</td>
                            <td>
                                <div class="row-action-container">
                                    <!-- TODO: Employee info view -->
                                    <button class="btn btn-primary" @click="approveRequest(employee, true)">
                                        <i class="fa-solid fa-circle-info"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="new-employee-section">
                <p>Didn't find who you were looking for?</p>
                <router-link to="/personnel_management/invite-new-employee">
                    <button class="btn btn-primary">
                        <i class="fa-solid fa-plus"></i> Invite New Employee
                    </button>
                </router-link>
            </div>
        </template>
    </SidebarLayout>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import SidebarLayout from '@/components/layouts/SidebarLayout.vue';
import { populateRoleDropdowns } from '@/utils/api_utils/personnelManagementUtils';
import debounce from 'lodash.debounce'

export default {
    components: {
        SidebarLayout,
    },
    name: 'EmployeeList',
    data() {
        return {
            employees: [],
            totalEmployees: 0,
            nextPage: null,
            previousPage: null,
            totalPages: 1,
            currentPage: 1,
            authStore: useAuthStore(),
            toast: useToast(),
            filters: {
                searchName: '',
                searchEmail: '',
                department: '',
                title: '',
            },
            departments: [],
            titles: [],
            baseAPI_URL: process.env.VUE_APP_DJANGO_API_URL,
        }
    },
    async mounted() {
        // Retrieve the dropdown options for departments and titles
        let dropdownOpts = await this.populateRoleDropdowns();
        this.departments = dropdownOpts.departmentOpts;
        this.titles = dropdownOpts.titleOpts;

        console.log(this.departments);
        console.log(this.titles);

        // Retrieve the employees
        await this.fetchEmployees(`${this.baseAPI_URL}/personnel/employees/`);
    },
    watch: {
        filters: {
            handler: debounce(function() {
                this.applyFilters();
            }, 500),
            deep: true,
        }
    },
    methods: {
        populateRoleDropdowns,
        async fetchEmployees(url = `${this.baseAPI_URL}/personnel/employees/`) {
            const params = {
                name: this.filters.searchName,
                email: this.filters.searchEmail,
                department: this.filters.department,
                title: this.filters.title,
            };

            axios.get(url, { headers: { Authorization: `Bearer ${this.authStore.accessToken}` }, params })
            .then(response => {
                const { results, count, next, previous } = response.data;

                // Update the data
                this.employees = results;
                this.totalEmployees = count;
                this.nextPage = next;
                this.previousPage = previous;

                // Calculate the amount of pages
                this.totalPages = Math.ceil(count / results.length);
                this.currentPage = this.getCurrentPage(url);
            })
            .catch(error => {
                console.error(error);
                this.toast.error('An error occurred while fetching the employees. Please try again later.', {
                    timeout: 2500,
                });
            });
        },
        applyFilters() {
            this.fetchEmployees();
        },
        getCurrentPage(url) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            return urlParams.has('page') ? parseInt(urlParams.get('page')) : 1;
        },
    },
}
</script>

<style scoped>
@import '../../../public/static/css/element_styling.css';
@import '../../../public/static/css/transitions.css';

.page-content {
    margin-top: 5px;
    padding: 1em;
    transition: 0.3s ease;
}

.search-container {
    display: flex;
    justify-content: space-between;
    gap: 25px;
}

.action-list {
    margin-left: 2%;
    margin-right: 2%;
}

h1 {
    color: #0D6EFD;
}

.new-employee-section {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 15px;
}
</style>