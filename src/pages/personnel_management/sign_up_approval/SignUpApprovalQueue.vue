<template>
<SidebarLayout>
    <template v-slot:contents>
        <h1 style="font-weight: bold; text-align: left; margin-bottom: 25px; margin-top: 0px;">Review Sign-up Requests</h1>
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
            </div>
            <div class="pagination-container">
                <button :disabled="previousPage == null" class="btn btn-primary">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                
                <button :disabled="nextPage == null" class="btn btn-primary">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table rounded-corners">
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Date Requested</th>
                        <th scope="col">Review</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="signUpRequests.length === 0">
                        <td colspan="6" style="text-align: center;">No sign-up requests to review.</td>
                    </tr>
                    <tr v-for="request in signUpRequests" :key="request.id">
                        <td>{{ request.username }}</td>
                        <td>{{ request.first_name }}</td>
                        <td>{{ request.last_name }}</td>
                        <td>{{ request.email }}</td>
                        <td>{{ formatDate(request.requested_date) }}</td>
                        <td>
                            <div class="row-action-container">
                                <button class="btn btn-primary" @click="approveRequest(request, true)">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                                <button class="btn btn-danger" @click="approveRequest(request, false)">
                                    <i class="fa-solid fa-x"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="new-employee-section">
            <p>Is there someone you'd like to invite?</p>
            <router-link to="/personnel_management/invite-new-employee">
                <button class="btn btn-primary">
                    <i class="fa-solid fa-plus"></i> Invite New Employee
                </button>
            </router-link>
        </div>

        <PopUpModal :show="modalOpts.showModal" width="650px">
            <template v-slot:header>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-weight: bold; color: #3B5EAB;">{{ modalOpts.modalTitle }}</h3>
                </div>
            </template>

            <template v-slot:body>
                <p style="color: black; text-align: left;">{{ modalOpts.modalBody }}</p>
                <div class="request-container">
                    <div class="signup-request-data">
                        <p><strong>Username:</strong> {{ this.modalOpts.selectedRequest.username }}</p>
                        <p><strong>First Name:</strong> {{ this.modalOpts.selectedRequest.first_name }}</p>
                        <p><strong>Last Name:</strong> {{ this.modalOpts.selectedRequest.last_name }}</p>
                        <p><strong>Email:</strong> {{ this.modalOpts.selectedRequest.email }}</p>
                    </div>
                    
                    <div v-if="approveCurrentRequest" class="role-selection-form">
                        <label for="department">Select Department:</label>
                        <v-select
                            style="width: 100%;"
                            :options="departments"
                            v-model="modalOpts.departmentId"
                            label="department_name"
                            :reduce="department => department.id"
                            placeholder="Select a department"
                        ></v-select>

                        <label style="margin-top: 20px;" for="title">Select Title:</label>
                        <v-select
                            style="width: 100%;"
                            :options="titles"
                            v-model="modalOpts.titleId"
                            label="title_name"
                            :reduce="title => title.id"
                            placeholder="Select a title"
                        ></v-select>
                    </div>
                </div>
            </template>

            <template v-slot:footer>
                <div style="display: flex; justify-content: center; gap: 10px; width: 100%">
                    <button class="btn btn-danger" style="width: 50%" @click="modalOpts.showModal = false">Cancel</button>
                    <button class="btn btn-success" style="width: 50%" @click="confirmApproval">{{ modalOpts.confirmAction }}</button>
                </div>
            </template>
        </PopUpModal>
    </template>
</SidebarLayout>
</template>

<script>
import SidebarLayout from '@/components/layouts/SidebarLayout.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import { formatDate } from '@/utils/dateUtils';
import PopUpModal from '@/components/ui/PopUpModal.vue';
import { populateRoleDropdowns } from '@/utils/api_utils/personnelManagementUtils';

export default {
    components: {
        SidebarLayout,
        PopUpModal
    },
    name: 'SignUpApprovalQueue',
    data() {
        return {
            toast: useToast(),
            signUpRequests: [],
            totalRequests: 0,
            nextPage: null,
            previousPage: null,
            currentPage: 1,
            totalPages: 1,
            modalOpts: {
                showModal: false,
                modalTitle: '',
                modalBody: '',
                selectedRequest: {},
                confirmAction: 'Approve',
                departmentId: null,
                titleId: null
            },
            filters: {
                searchName: '',
                searchEmail: '',
            },
            departments: [],
            titles: [],
            baseAPI_URL: process.env.VUE_APP_DJANGO_API_URL,
            approveCurrentRequest: false
        };
    },
    watch: {
        filters: {
            handler: 'getInitialSignUpRequests',
            deep: true,
        },
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

        this.getInitialSignUpRequests();
    },
    methods: {
        formatDate,
        populateRoleDropdowns,
        async getInitialSignUpRequests() {
            
            const authStore = useAuthStore();
            
            if (await authStore.ensureValidToken(authStore)) {
                this.getSignUpRequests(`${this.baseAPI_URL}/auth/sign-up-approval-queue/`, authStore.accessToken);
            } else {
                this.toast.error('Unable to fetch sign-up requests due to authentication issues. Please log in again.', {
                    timeout: 2500,
                });
            }
        },
        getSignUpRequests(url, token) {
            const params = {
                name: this.filters.searchName,
                email: this.filters.searchEmail,
            };

            axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }, params
            })
            .then(response => {
                const { results, count, next, previous } = response.data;

                // Update the data
                this.signUpRequests = results;
                this.totalRequests = count;
                this.nextPage = next;

                // Calculate the amount of pages
                this.previousPage = previous;
                this.totalPages = isNaN(Math.ceil(count / results.length) > 0) ? Math.ceil(count / results.length) : 1;
            })
            .catch(error => {
                console.error(error);
                this.toast.error('An error occurred while fetching the sign-up requests. Please try again later.', {
                    timeout: 2500,
                });
            });
        },
        approveRequest(selectedRequest_data, approving) {
            this.approveCurrentRequest = approving;

            if (approving) {
                this.modalOpts.modalTitle = 'Approve Sign-up Request';
                this.modalOpts.modalBody = 'Are you sure you want to approve this sign-up request?';
                this.modalOpts.confirmAction = 'Approve';
            } else {
                this.modalOpts.modalTitle = 'Reject Sign-up Request';
                this.modalOpts.modalBody = 'Are you sure you want to reject this sign-up request?';
                this.modalOpts.confirmAction = 'Reject';
            }
            
            this.modalOpts.showModal = true;
            this.modalOpts.selectedRequest = selectedRequest_data;
        },
        confirmApproval() {
            const authStore = useAuthStore();
            this.modalOpts.showModal = false;

            if (this.modalOpts.confirmAction === 'Approve') {
                // Verify that the department and title IDs are not null
                if (this.modalOpts.departmentId === null || this.modalOpts.titleId === null) {
                    this.toast.error('Please select a department and title for the user.', {
                        timeout: 2500,
                    });
                    return;
                }

                // Approve the sign-up request
                const requestId = this.modalOpts.selectedRequest.id;
                axios.post(`${this.baseAPI_URL}/auth/approve-sign-up-request/${requestId}/`, 
                    {
                        department_id: this.modalOpts.departmentId,
                        title_id: this.modalOpts.titleId
                    },
                    {
                        headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
                    }
                )
                .then(() => {
                    this.getInitialSignUpRequests();

                    this.toast.success('Sign-up request approved successfully.', {
                        timeout: 2500,
                    });
                })
                .catch(error => {
                    console.error(error);
                    this.toast.error('An error occurred while approving the sign-up request. Please try again later.', {
                        timeout: 2500,
                    });
                    this.getInitialSignUpRequests();
                });
            } else {
                // Reject the sign-up request
                const requestId = this.modalOpts.selectedRequest.id;
                axios.post(`${this.baseAPI_URL}/auth/approve-sign-up-request/${requestId}/`, 
                    {
                        reject: true
                    },
                    {
                        headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
                    }
                )
                .then(response => {
                    console.log(response.data);
                    this.getInitialSignUpRequests();

                    this.toast.success(`Sign-up request ${this.modalOpts.confirmAction.toLowerCase()} successfully.`, {
                        timeout: 2500,
                    });
                })
                .catch(() => {
                    this.toast.error('An error occurred while rejecting the sign-up request. Please try again later.', {
                        timeout: 2500,
                    });
                    this.getInitialSignUpRequests();
                });
            }
        }
    },
};
</script>

<style scoped>
@import '../../../../public/static/css/element_styling.css';
@import '../../../../public/static/css/transitions.css';

.page-content {
    margin-top: 5px;
    padding: 1em;
    transition: 0.3s ease;
}

.action-list {
    margin-left: 2%;
    margin-right: 2%;
}

h1 {
    color: #0D6EFD;
}

.signup-request-data {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    flex-direction: column;
    align-content: flex-start;
    text-align: left;
}

.request-container {
    display: flex;
    justify-content: space-between;
    gap: 25px;
}

.role-selection-form {
    display: flex;
    width: 40%;
    flex-direction: column;
    align-items: flex-start;
}

.search-container {
    display: flex;
    justify-content: space-between;
    gap: 25px;
}

.new-employee-section {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 15px;
}
</style>
