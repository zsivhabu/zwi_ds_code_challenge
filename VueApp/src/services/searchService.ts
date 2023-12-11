import axios from 'axios'
import type {SearchFilter} from "@/models/ui/searchFilter";

export class SearchService {



    async search(searchFilter: SearchFilter):Promise<String[]> {
        try {

            const buildQueryString = (searchFilter: SearchFilter): string => {
                const validParams: Record<string, string | number> = {};

                for (const key in searchFilter) {
                    // @ts-ignore
                    const value = searchFilter[key];
                    if (value !== 'Any' && value != 'any' && value !== undefined && value !== '' && value !== 0) {
                        validParams[key] = value;
                    }
                }

                const queryString = Object.keys(validParams)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(validParams[key]))}`)
                    .join('&');

                return queryString;
            };
            const queryString = buildQueryString(searchFilter);
            const url = `/api/search?${queryString}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw error
        }
    }

}

