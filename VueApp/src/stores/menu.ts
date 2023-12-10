import { defineStore } from "pinia";

interface MenuState {
    isSidebarHidden: boolean;
    isHideSelectFilters: boolean;
    routeName: string;
}

export const useMenuStore = defineStore("menuState", {
    state: (): MenuState => ({
        isSidebarHidden: false,
        isHideSelectFilters: true,
        routeName: "",
    }),
    persist: true,
    getters: {
        getSidebarHidden: (state: MenuState): boolean => {
            return state.isSidebarHidden;
        },
        getHideSelectFilters: (state: MenuState): boolean => {
            return state.isHideSelectFilters;
        },
        getRouteName: (state: MenuState): string => {
            return state.routeName;
        },
    },
    actions: {
        toggleSidebar() {
            this.isSidebarHidden = !this.isSidebarHidden;
        },
        toggleSelectFilters() {
            this.isHideSelectFilters = !this.isHideSelectFilters;
        },
        setRouteName(routeName: string) {
            this.routeName = routeName;
        },
    },
});
