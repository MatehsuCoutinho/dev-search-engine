import axios from 'axios';
import { StackOverflowProvider } from '../../providers/StackOverflowProvider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockApiResponse = {
    data: {
        items: [
            {
                question_id: 123456,
                title: 'How to use useEffect correctly?',
                body: 'I am trying to use useEffect...',
                link: 'https://stackoverflow.com/questions/123456',
                owner: { display_name: 'john_doe' },
                tags: ['react', 'hooks'],
                score: 42,
                is_answered: true,
                view_count: 1500,
                creation_date: 1704067200,
            },
        ],
        has_more: false,
        quota_remaining: 299,
    },
};

describe('StackOverflowProvider', () => {
    let provider: StackOverflowProvider;

    beforeEach(() => {
        provider = new StackOverflowProvider();
        jest.clearAllMocks();
    });

    it('should return data from Stack Exchange API', async () => {
        mockedAxios.get = jest.fn().mockResolvedValue(mockApiResponse);

        const result = await provider.search('react hooks');

        expect(result.items).toHaveLength(1);
        expect(result.items[0].question_id).toBe(123456);
        expect(result.quota_remaining).toBe(299);
    });

    it('should call the API with correct parameters', async () => {
        mockedAxios.get = jest.fn().mockResolvedValue(mockApiResponse);

        await provider.search('react hooks');

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://api.stackexchange.com/2.3/search/advanced',
            expect.objectContaining({
                params: expect.objectContaining({
                    q: 'react hooks',
                    site: 'stackoverflow',
                    filter: 'withbody',
                    sort: 'relevance',
                }),
            })
        );
    });

    it('should throw a formatted error when API returns an error', async () => {
        const axiosError = {
            isAxiosError: true,
            response: { status: 400, statusText: 'Bad Request' },
        };
        mockedAxios.get = jest.fn().mockRejectedValue(axiosError);

        // Força o axios.isAxiosError a retornar true para esse objeto
        jest.spyOn(axios, 'isAxiosError').mockImplementationOnce(() => true);

        await expect(provider.search('react hooks')).rejects.toThrow(
            'Stack Exchange API error: 400 - Bad Request'
        );
    });

    it('should throw a generic error for unexpected failures', async () => {
        mockedAxios.get = jest.fn().mockRejectedValue(new Error('Network error'));

        jest.spyOn(axios, 'isAxiosError').mockImplementationOnce(() => false);

        await expect(provider.search('react hooks')).rejects.toThrow(
            'Unexpected error while fetching from Stack Exchange API'
        );
    });
});