import axios from 'axios'

export class MapService {

    async getH3Blocks():Promise<[]> {
        try {
            const url = `api/get-h3-blocks`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw error
        }
    }

}

