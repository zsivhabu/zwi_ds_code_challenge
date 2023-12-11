import axios from 'axios'

export class SelectListService {

    async GetSelectList(url: string, includeDefaultSelectOption:boolean=true): Promise<string[]> {
        try {
            const response = await axios.get(url);
            const selectOptions = response.data;
            if (includeDefaultSelectOption){
                return [
                    'Any',
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

    async getSelectOptions(columnName: string, includeDefaultSelectOption:boolean=true):Promise<string[]> {
       return this.GetSelectList(`/api/unique-by-column/${columnName}`,includeDefaultSelectOption );
    }

}

