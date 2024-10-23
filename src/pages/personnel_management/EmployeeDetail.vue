<template>
    <SidebarLayout>
        <template v-slot:contents>
            <h1 style="font-weight: bold; text-align: left; margin-bottom: 25px; margin-top: 0px;">Employee Information</h1>
            {{ employeeId }}
            <!-- TODO: Finish Employee profile view -->
        </template>
    </SidebarLayout>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import SidebarLayout from '@/components/layouts/SidebarLayout.vue';

export default {
    components: {
        SidebarLayout,
    },
    name: 'EmployeeDetail',
    setup() {
        const route = useRoute();
        const employeeId = ref(null);

        onMounted(() => {
            employeeId.value = route.params.emp_id;
            console.log(employeeId.value);
        });

        return {
            employeeId,
        };
    },
};
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