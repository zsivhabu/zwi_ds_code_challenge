import axios from 'axios'

export class ChartService {

    async suburbIncidentsByDirectorate():Promise<String[]> {
        try {
            const url = `api/suburbs-incidents-by-directorate`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async directorateAggregated(directorate: string):Promise<String[]> {
        try {
            const url = `api/suburbs-incidents?directorate=${directorate}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw error
        }
    }

}

