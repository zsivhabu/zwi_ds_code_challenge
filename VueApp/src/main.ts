import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import VueDatePicker from '@vuepic/vue-datepicker';
import {Axios} from "@/plugins/axios";
// @ts-ignore
import vSelect from 'vue-select'

//css imports
import '@vuepic/vue-datepicker/dist/main.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'vue-select/dist/vue-select.css';

Promise.all([

]).then(async () => {
    const app = createApp(App)

    // pinia store management setup
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)

    //axios setup
    await new Axios(app).initConfigs();

    app.component('v-select', vSelect)
    app.component('VueDatePicker', VueDatePicker);

    app.use(router)

    app.mount('#app')
});
