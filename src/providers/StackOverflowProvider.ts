import axios from 'axios';
import { IStackOverflowResponse } from '../interfaces/IStackOverflowResponse';

const BASE_URL = 'https://api.stackexchange.com/2.3';

export class StackOverflowProvider {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.STACK_EXCHANGE_API_KEY || '';
    }

    async search(query: string): Promise<IStackOverflowResponse> {
        try {
            const params: any = {
                q: query,
                site: 'stackoverflow',
                filter: 'withbody',
                order: 'desc',
                sort: 'relevance',
                pagesize: 10,
            };

            if (this.apiKey) {
                params.key = this.apiKey;
            }

            const response = await axios.get<IStackOverflowResponse>(
                `${BASE_URL}/search/advanced`,
                { params }
            );

            console.log(`Stack Exchange quota remaining: ${response.data.quota_remaining}`);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    `Stack Exchange API error: ${error.response?.status} - ${error.response?.statusText}`
                );
            }
            throw new Error('Unexpected error while fetching from Stack Exchange API');
        }
    }
}