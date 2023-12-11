import { defineStore } from "pinia";
import type {SearchFilter} from "@/models/ui/searchFilter";


const DEFAULT_SEARCH_FILTERS: SearchFilter = {
    branch: "any", causeCode: "any", causeCodeGroup: "any", code: "any", completion_end_date: "any",
    completion_start_date: "any", creation_end_date: "any", creation_start_date: "any", department: "any",
    directorate: "any", hexId: "any", latitude: 0, longitude: 0, notificationNumber: "any", officialSuburb: "any",
    page_number: 0, page_size: 0, radius: 0, referenceNumber: "any", section: "any"
}

interface MenuState {
    isSidebarHidden: boolean;
    isHideSelectFilters: boolean;
    routeName: string;
    searchFilter: SearchFilter;
    submitIncrement: number;
    selectedDirectorate: string;
}

export const useMenuStore = defineStore("menuState", {
    state: (): MenuState => ({
        isSidebarHidden: false,
        isHideSelectFilters: true,
        routeName: "",
        searchFilter: DEFAULT_SEARCH_FILTERS,
        submitIncrement: 0,
        selectedDirectorate: "URBAN WASTE MANAGEMENT"
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
        incrementSubmit() {
            this.submitIncrement++;
        },
        setSelectedDirectorate(directorate: string) {
            this.selectedDirectorate = directorate;
        }
    },
});
