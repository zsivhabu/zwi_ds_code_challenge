import { defineStore } from "pinia";

interface GlobalLoaderState {
    loading: boolean,
    loaderEnabled: boolean
}

export const useGlobalLoader = defineStore("GlobalLoaderState", {
    state: (): GlobalLoaderState => ({
        loading: false,
        loaderEnabled: true
    }),
    getters: {

    },
    actions: {
        async updateLoaderEnabled (value: boolean) {
            this.loaderEnabled = value
        },
    }
});
