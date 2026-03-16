import { MapperService } from '../../services/MapperService';
import { IStackOverflowItem } from '../../interfaces/IStackOverflowResponse';

const mockItem: IStackOverflowItem = {
    question_id: 123456,
    title: 'How to use useEffect correctly?',
    body: 'I am trying to use useEffect but it runs twice...',
    link: 'https://stackoverflow.com/questions/123456',
    owner: { display_name: 'john_doe' },
    tags: ['react', 'hooks'],
    score: 42,
    is_answered: true,
    view_count: 1500,
    creation_date: 1704067200, // 2024-01-01T00:00:00.000Z
};

describe('MapperService', () => {
    describe('fromStackOverflow', () => {
        it('should map a StackOverflow item to ISearchResult correctly', () => {
            const result = MapperService.fromStackOverflow(mockItem);

            expect(result.id).toBe('so_123456');
            expect(result.title).toBe('How to use useEffect correctly?');
            expect(result.content).toBe('I am trying to use useEffect but it runs twice...');
            expect(result.url).toBe('https://stackoverflow.com/questions/123456');
            expect(result.author).toBe('john_doe');
            expect(result.tags).toEqual(['react', 'hooks']);
            expect(result.score).toBe(42);
            expect(result.isAnswered).toBe(true);
            expect(result.viewCount).toBe(1500);
            expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
        });

        it('should use "Unknown" when owner display_name is missing', () => {
            const itemWithoutOwner = { ...mockItem, owner: { display_name: '' } };
            const result = MapperService.fromStackOverflow(itemWithoutOwner);

            expect(result.author).toBe('Unknown');
        });

        it('should use empty string when body is missing', () => {
            const itemWithoutBody = { ...mockItem, body: undefined as any };
            const result = MapperService.fromStackOverflow(itemWithoutBody);

            expect(result.content).toBe('');
        });

        it('should use empty array when tags are missing', () => {
            const itemWithoutTags = { ...mockItem, tags: undefined as any };
            const result = MapperService.fromStackOverflow(itemWithoutTags);

            expect(result.tags).toEqual([]);
        });
    });

    describe('manyFromStackOverflow', () => {
        it('should map multiple items correctly', () => {
            const items = [mockItem, { ...mockItem, question_id: 789 }];
            const results = MapperService.manyFromStackOverflow(items);

            expect(results).toHaveLength(2);
            expect(results[0].id).toBe('so_123456');
            expect(results[1].id).toBe('so_789');
        });

        it('should return empty array when given empty array', () => {
            const results = MapperService.manyFromStackOverflow([]);

            expect(results).toHaveLength(0);
        });
    });
});