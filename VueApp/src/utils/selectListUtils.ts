import type {DirtySelectOption, SelectOption} from "@/models/ui/selectOption";

export class SelectListUtils {
    static readonly DEFAULT_SELECT_LIST_OPTION: SelectOption = {id: 0, value: 0, label: 'Select', active: true, description: 'Select'};
    static readonly DEFAULT_DIRTY_SELECT_LIST_OPTION: DirtySelectOption = {id: "0", value:"0", label: 'Select', active: true, description: 'Select'};
}