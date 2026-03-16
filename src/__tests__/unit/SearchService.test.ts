import { SearchService } from '../../services/SearchService';
import { MeilisearchService } from '../../services/MeilisearchService';
import { StackOverflowProvider } from '../../providers/StackOverflowProvider';
import { MapperService } from '../../services/MapperService';

jest.mock('../../services/MeilisearchService');
jest.mock('../../providers/StackOverflowProvider');

const mockMapped = [
    {
        id: 'so_123456',
        title: 'How to use useEffect correctly?',
        content: 'I am trying to use useEffect...',
        url: 'https://stackoverflow.com/questions/123456',
        author: 'john_doe',
        tags: ['react', 'hooks'],
        score: 42,
        isAnswered: true,
        viewCount: 1500,
        createdAt: '2024-01-01T00:00:00.000Z',
    },
];

const mockApiResponse = {
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
};

describe('SearchService', () => {
    let searchService: SearchService;
    let mockMeilisearch: jest.Mocked<MeilisearchService>;
    let mockProvider: jest.Mocked<StackOverflowProvider>;

    beforeEach(() => {
        jest.clearAllMocks();
        searchService = new SearchService();

        mockMeilisearch = (MeilisearchService as jest.Mock).mock.instances[0];
        mockProvider = (StackOverflowProvider as jest.Mock).mock.instances[0];
    });

    it('should return cached results when Meilisearch has data', async () => {
        mockMeilisearch.isEmpty = jest.fn().mockResolvedValue(false);
        mockMeilisearch.search = jest.fn().mockResolvedValue(mockMapped);

        const results = await searchService.search('react hooks');

        expect(mockMeilisearch.isEmpty).toHaveBeenCalledWith('react hooks');
        expect(mockMeilisearch.search).toHaveBeenCalledWith('react hooks');
        expect(mockProvider.search).not.toHaveBeenCalled();
        expect(results).toEqual(mockMapped);
    });

    it('should fetch from API and index when cache is empty', async () => {
        mockMeilisearch.isEmpty = jest.fn().mockResolvedValue(true);
        mockMeilisearch.upsert = jest.fn().mockResolvedValue(undefined);
        mockProvider.search = jest.fn().mockResolvedValue(mockApiResponse);

        jest.spyOn(MapperService, 'manyFromStackOverflow').mockReturnValue(mockMapped);

        const results = await searchService.search('react hooks');

        expect(mockProvider.search).toHaveBeenCalledWith('react hooks');
        expect(mockMeilisearch.upsert).toHaveBeenCalledWith(mockMapped);
        expect(results).toEqual(mockMapped);
    });

    it('should return empty array when API returns no items', async () => {
        mockMeilisearch.isEmpty = jest.fn().mockResolvedValue(true);
        mockProvider.search = jest.fn().mockResolvedValue({ items: [], has_more: false, quota_remaining: 299 });

        const results = await searchService.search('react hooks');

        expect(results).toEqual([]);
        expect(mockMeilisearch.upsert).not.toHaveBeenCalled();
    });
});