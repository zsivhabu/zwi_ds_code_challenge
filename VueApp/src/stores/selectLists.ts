import { defineStore } from "pinia";

interface selectListsState {
    directorateList: string[],
    branchList: string[],
    departmentList: string[],
    causeCodeList: string[],
    causeCodeGroupList: string[],
    codeList: string[],
    hexIdList: string[],
    officialSuburbList: string[],
    sectionList: string[],
}

export const useSelectLists = defineStore("selectListsState", {
    state: (): selectListsState => ({
        directorateList: [],
        branchList: [],
        departmentList: [],
        causeCodeList: [],
        causeCodeGroupList: [],
        codeList: [],
        hexIdList: [],
        officialSuburbList: [],
        sectionList: []
    }),
    persist: true,
    getters: {
        findDirectorate: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.directorateList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }
        },
        findBranch: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.branchList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }
        },
        findDepartment: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.departmentList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }
        },
        findCauseCode: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.causeCodeList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }
        },
        findCauseCodeGroup: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.causeCodeGroupList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }
        },
        findCode: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.codeList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }
        },
        findHexId: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.hexIdList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }
        },
        findOfficialSuburb: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.officialSuburbList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }

        },
        findSection: (state: selectListsState) => (id: any | undefined) : string => {
            try {
                let selectOption = state.sectionList.filter((selectOption: string) => selectOption == id)[0];
                if (selectOption == undefined)
                    throw new Error("SelectOption not found")
                return selectOption
            }
            catch (e) {
                return 'Not Selected'
            }
        }
    },
    actions: {

    }
});


