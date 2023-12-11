import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import VueDatePicker from '@vuepic/vue-datepicker';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import {Axios} from "@/plugins/axios";
// @ts-ignore
import vSelect from 'vue-select'
// @ts-ignore
import {Tab, Tabs} from 'vue3-tabs-component';

//css imports
import '@vuepic/vue-datepicker/dist/main.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'vue-select/dist/vue-select.css';
import 'vue3-easy-data-table/dist/style.css';
import 'vue3-easy-data-table/dist/style.css';

Promise.all([

]).then(async () => {
    const app = createApp(App)

    // pinia store management setup
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)

    app.component('v-select', vSelect)
    app.component('VueDatePicker', VueDatePicker);
    app.component('EasyDataTable', Vue3EasyDataTable);
    app.component('tabs', Tabs)
    app.component('tab', Tab)
    app.use(router)

    //axios setup
    await new Axios(app).initConfigs();

    app.mount('#app')
});
