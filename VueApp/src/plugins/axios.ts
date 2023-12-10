import axios from "axios";
import { storeToRefs } from "pinia";
import {useGlobalLoader} from "@/stores/globalLoader";

export class Axios {

    private readonly appInstance: any;
    constructor(app: any) {
        this.appInstance = app;
    }

    public async initConfigs() {
        axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
        axios.defaults.headers.post['Content-Type'] = 'application/json'

        const globalLoader = useGlobalLoader()
        let { loading } = storeToRefs(globalLoader)

        // request interceptor when request is sent
        axios.interceptors.request.use(async function (config: any) {
            loading.value = true
            return config;
        }, function (error: any) {
            loading.value = false
            return Promise.reject(error);
        });

        // response interceptor when response is received
        axios.interceptors.response.use(function (response: any) {
            loading.value = false
            return response;
        }, function (error: any) {
            loading.value = false
            return Promise.reject(error);
        });

    }
}