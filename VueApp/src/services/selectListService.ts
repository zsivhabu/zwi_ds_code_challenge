import axios from 'axios'
import {SelectListUtils} from "@/utils/selectListUtils";
import type {DirtySelectOption, SelectOption} from "@/models/ui/selectOption";

export class SelectListService {

    async GetSelectList(url: string, includeDefaultSelectOption:boolean=true): Promise<SelectOption[]> {
        try {
            const response = await axios.get(url);
            const selectOptions = response.data.result.map((selectOption: SelectOption) => {
                return {
                    ...selectOption,
                    id: selectOption.value,
                    label: selectOption.description
                };
            }); 
            if (includeDefaultSelectOption){
                return [
                    {id: 0, value: 0, label: 'Select', active: true, description: 'Select'},
                    ...selectOptions
                ];
            }
            else {
                return selectOptions
            }
        } catch (error) {
            throw error;
        }
    }

    async GetDirtySelectList(url: string, includeDefaultSelectOption:boolean=true): Promise<DirtySelectOption[]> {
        try {
            const response = await axios.get(url);
            const selectOptions = response.data.result.map((selectOption: DirtySelectOption) => {
                return {
                    ...selectOption,
                    id: selectOption.value,
                    label: selectOption.description
                };
            });
            if (includeDefaultSelectOption){
                return [
                    SelectListUtils.DEFAULT_DIRTY_SELECT_LIST_OPTION,
                    ...selectOptions
                ];
            }
            else {
                return selectOptions
            }
        } catch (error) {
            throw error;
        }
    }

    async getDirectorateSelectList(includeDefaultSelectOption:boolean=true):Promise<SelectOption[]> {
       return this.GetSelectList('/api/List/',includeDefaultSelectOption );
    }

}

