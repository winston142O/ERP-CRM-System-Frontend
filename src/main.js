import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import '@fortawesome/fontawesome-free/js/all';

const app = createApp(App);

// Router
app.use(router);

// Pinia
const pinia = createPinia();
app.use(pinia);

// Toast options
const options = {};
app.use(Toast, options);

app.mount('#app');
