import { defineStore } from "pinia";
import type {SelectOption} from "@/models/ui/selectOption";
import {SelectListUtils} from "@/utils/selectListUtils";

interface selectListsState {
    directorateList: SelectOption[],
}

export const useSelectLists = defineStore("selectListsState", {
    state: (): selectListsState => ({
        directorateList: [],
    }),
    persist: true,
    getters: {
        findDirectorate: (state: selectListsState) => (id: any | undefined) : SelectOption => {
            try {
                let selectOption = state.directorateList.filter((selectOption: SelectOption) => selectOption.id == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return SelectListUtils.DEFAULT_SELECT_LIST_OPTION
            }
        }
    },
    actions: {

    }
});


