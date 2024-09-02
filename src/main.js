import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import '@fortawesome/fontawesome-free/js/all';
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const app = createApp(App);

// Router
app.use(router);

// Pinia
const pinia = createPinia();
app.use(pinia);

// Toast options
const options = {};
app.use(Toast, options);

// Vue Select
app.component('v-select', vSelect);

app.mount('#app');
