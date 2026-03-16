import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { SearchController } from '../../controllers/SearchController';
import { SearchService } from '../../services/SearchService';

jest.mock('../../services/SearchService');

const mockResults = [
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

describe('POST /search', () => {
    let app: express.Application;
    let mockSearchService: jest.Mocked<SearchService>;

    // Cria o servidor uma única vez antes de todos os testes
    beforeAll(() => {
        app = express();
        app.use(cors());
        app.use(express.json());

        const searchController = new SearchController();
        app.post('/search', (req, res) => searchController.search(req, res));

        // Captura a instância após o app ser criado
        mockSearchService = (SearchService as jest.Mock).mock.instances[0];
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 with results when query is valid', async () => {
        mockSearchService.search = jest.fn().mockResolvedValue(mockResults);

        const response = await request(app)
            .post('/search')
            .send({ q: 'react hooks' });

        expect(response.status).toBe(200);
        expect(response.body.query).toBe('react hooks');
        expect(response.body.total).toBe(1);
        expect(response.body.results).toHaveLength(1);
        expect(response.body.results[0].id).toBe('so_123456');
    });

    it('should return 400 when q is missing', async () => {
        const response = await request(app)
            .post('/search')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing required parameter: q');
    });

    it('should return 400 when q is empty string', async () => {
        const response = await request(app)
            .post('/search')
            .send({ q: '   ' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing required parameter: q');
    });

    it('should return 200 with empty results when nothing is found', async () => {
        mockSearchService.search = jest.fn().mockResolvedValue([]);

        const response = await request(app)
            .post('/search')
            .send({ q: 'xyzabcnotfound' });

        expect(response.status).toBe(200);
        expect(response.body.total).toBe(0);
        expect(response.body.results).toHaveLength(0);
    });

    it('should return 500 when SearchService throws an error', async () => {
        mockSearchService.search = jest.fn().mockRejectedValue(new Error('Unexpected error'));

        const response = await request(app)
            .post('/search')
            .send({ q: 'react hooks' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal server error while processing your search');
    });
});